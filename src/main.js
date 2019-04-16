const fs        = require('fs');
const Astar     = require('./Astar.js');
const BLogic    = require('./BLogic');

function showHelp() {
    console.log('=================================================');
    console.log('[!] Usage: Npuzzle [-flag] map');
    console.log('[+] Flags list : ');
    console.log("[+] -md, \t Use the manathan distance heuristic");
    console.log("[+] -lc, \t Use the linear conflict heuristic");
    console.log("[+] -wp, \t Use the wrong position heuristic");
    console.log('=================================================');
}

function checkArgs(args) {
    let h = 1, i, b = true;

    if (args.length == 0) {
        args.push('-h');
    }

    for (i = 0; i < args.length; i++){
        if (args[i] == '-h' || args[i] == '-help') {
            showHelp();
            h = 0;
            break ;
        } else if (args[i] == '-lc') {
            h = 3;
            args.splice(i, i + 1);
            break ;
        } else if (args[i] == '-wp') {
            h = 2;
            args.splice(i, i + 1);
            break ;
        } else if (args[i] == '-md') {
            h = 1;
            args.splice(i, i + 1);
            break ;
        } else {
            h = 1;
            break ;
        }
    }

    if (args.length == 0) {
        showHelp();
        h = 0;
    }

    return ({args, h, b})
}

function readFromFile(filename) {
    let n = 0;
    let map = [];
    let mapLine = 0;

    if (fs.existsSync(filename)) {
        let file = fs.readFileSync(filename, 'UTF8');

        if (!file)
            throw `Not existing file : ${filename}`

        file = file.split('\n');

        for (let i = 0, line; i < file.length; i++, line = '') {
            line = file[i];

            if (line[0] == '#' || line.length == 0)
                continue ;

            let strEnd = line.indexOf('#');

            if (strEnd != -1)
                line = line.substr(0, strEnd);

            if (n == 0) {
                let endPos = line.lastIndexOf(' \t');

                if (endPos != -1)
                    line = line.substr(0, endPos);

                n = line.split(' ').reduce((val, curr) => val + curr);

                if (n < 3)
                    return (n);
            } else {
                map[mapLine] = [];
                line.split(' ').map((val) => {
                    val = parseInt(val);
                    !isNaN(val) ? map[mapLine].push(val) : 0;
                });
                mapLine++;
            }
        }

        checkSolveAble(map);

        return ({map});
    } else {
        throw `Not existing file : ${filename}`;
    }
}

function checkSolveAble (map) {
    let z = 0;
    let s = 0;
    let cl = [];

    if (map.length < 3)
        throw 'Wrong map';

    for (let i = 0; i < map.length; i++)
        if (map[i].find((el) => el == 0) !== undefined)
            z = (i + 1) % 2 ? i + 1 : i;

    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            let tmp = 0;

            for (let c = 0; c < cl.length; c++)
                if (map[i][j] > cl[c])
                    tmp++;

            cl.push(map[i][j]);
            s += map[i][j] - tmp + z;
            tmp = 0;
        }
    }

    if ((s % 2))
        throw 'Puzzle is not solveable';
}

function collectedMap(n) {
    let arr = [];

    for (let i = 0; i < n; i++) {
        arr[i] = [];
        for (let j = 0; j < n; j++)
            arr[i][j] = 0;
    }

    let i = 1, j, k, p = n / 2;

    for(k=1;k<=p;k++)
    {
        for (j=k-1;j<n-k+1;j++)
            arr[k-1][j]=i++;
        for (j=k;j<n-k+1;j++)
            arr[j][n-k]=i++;
        for (j=n-k-1;j>=k-1;--j)
            arr[n-k][j]=i++;
        for (j=n-k-1;j>=k;j--)
            arr[j][k-1]=i++;
    }

    for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++)
            arr[i][j] == n * n ? arr[i][j] = 0 : 0;

    return arr;
}

function start () {
    try {
        const {h, args} = checkArgs(process.argv.splice(2));

        if (!h)
            return (-1);

        const {map} = readFromFile(args[0]);
        let fin = collectedMap(map.length);
        let b = new BLogic({start: map, solved: fin, heruistic: h});
        let astar = new Astar(b);
        astar.solve();
    } catch (e) {
        console.log('[!] Catch err : \n', e);
    }
}

start();
