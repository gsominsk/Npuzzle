class PriorityQueue {
    constructor () {
        this.queue = [];
    }

    push (data, priority) {
        if (this.queue.length == 0) {
            return this.queue.push({data, priority});
        }

        let index = this.queue.findIndex((obj, i, queue) => {
            return priority <= obj.priority
        });
        this.queue.splice(index, 0, {data, priority});
    }

    top() {
        return this.queue[0];
    }

    pop() {
        let tmp = this.queue[0];
        this.queue = this.queue.splice(1, this.queue.length);
        return tmp.data;
    }
}

class List {
    constructor () {
        this.list = [];
    }

    unshift (data) {
        this.list.unshift(data);
    }

    push (data) {
        this.list.push(data);
    }

    head() {
        return this.list[0];
    }

    iterateHeadG() {
        this.list[0].g++;
    }

    size() {
        return this.list.length;
    }
}

class Astar {
    constructor (i) {
        this.init = i;
    }

    compare(a1, a2) {
        let arr1 = a1.unsolvedMap;
        for (let i = 0; i < a2.length; i++) {
            let equal = true;
            for (let j = 0; j < a2[i].arr.length; j++) {
                for (let c = 0; c < a2[i].arr[j].length; c++) {
                    if (arr1[j][c] !== a2[i].arr[j][c]) {
                        equal = false;
                        break ;
                    }
                }

                if (!equal) {
                    break ;
                }

            }
            if (equal)
                return false;

        }
        return true ;
    }

    drawMap(list) {
        for(let i = list.size() - 1; i >= 0; i--) {
            console.log();
            for (let j = 0; j < list.list[i].unsolvedMap.length; j++) {
                for (let c = 0; c < list.list[i].unsolvedMap[j].length; c++) {
                    let s = list.list[i].unsolvedMap[j][c];

                    if (s == 0) {
                        process.stdout.write(`\x1b[32m${s}${s > 9 ? ' ' : '  '}\x1b[0m`);
                    } else
                        process.stdout.write(`\x1b[34m${s}${s > 9 ? ' ' : '  '}\x1b[0m`);
                }
                process.stdout.write('\n');
            }
        }
    }

    measure(obj) {
        return obj.g + obj.h;
    }

    copyList(to, from) {
        for (let i = 0; i < from.list.length; i++)
            to.push(from.list[i]);
        return to;
    }

    solve() {
        let stack = [];
        let cit = 0;
        let list = new List();
        let priorityQueue = new PriorityQueue();

        list.unshift(this.init);
        priorityQueue.push(list, 100000);


        let check = 0;
        while (true) {
            let tmp = priorityQueue.top().data.head();
            stack.push({p: tmp.h + tmp.g, arr: tmp.unsolvedMap});

            let curr = priorityQueue.top().data;

            list = priorityQueue.pop();
            if (list.head().call('end')) {
                console.log('\x1b[32m-------------- SOLVED ----------------\x1b[0m');
                this.drawMap(list);
                console.log('\x1b[32m--------------------------------------\x1b[0m');
                console.log('\x1b[32m[+] moves to win : ' + list.size());
                console.log('\x1b[32m[+] complexity ');
                console.log('\x1b[32m[+] in time : ' +  cit);
                console.log('\x1b[32m[+] in size : ' +  (cit - list.size()));
                console.log('\x1b[32m--------------------------------------\x1b[0m');

                return ;
            }

            let inclusions = list.head().call('inclusions');
            for (let i = 0; i < inclusions.length; i++) {
                if (inclusions[i] != null && this.compare(inclusions[i], stack, this.init.heruistic)) {
                    let newList = new List();
                    newList.unshift(inclusions[i]);
                    newList = this.copyList(newList, curr);
                    newList.iterateHeadG();
                    priorityQueue.push(newList, this.measure(newList.head()));
                    cit++;
                }
            }

            check++;
        }
    }
}

module.exports = Astar;
