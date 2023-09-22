var util = require('util');
var ee = require('events');

function DB() {
    this.db_data = [
        {id: 1, name: 'Charles Peirce', bday: '1839-09-10'},
        {id: 2, name: 'William James', bday: '1842-01-11'},
        {id: 3, name: 'John Dewey', bday: '1859-10-20'},
        {id: 4, name: 'Franz Brentano', bday: '1838-01-16'},
        {id: 5, name: 'Edmund Husserl', bday: '1859-04-08'},
        {id: 6, name: 'Martin Heidegger', bday: '1889-09-26'}
    ];

    this.get = () => {return this.db_data;}
    this.post = (r) => { 
        let k = this.db_data.find(x => x.id == r.id);
        if (k) {return;}
        this.db_data.push(r);
    }
    this.delete = (id)=>{
        let r = this.db_data.find(x => x.id == id);
        if (!r) {return;}
        this.db_data.splice(this.db_data.indexOf(r), 1);
        return r;
    };
    this.put = (r) => {
        let k = this.db_data.find(x => x.id == r.id);
        if (!k) {return;}
        let index = this.db_data.indexOf(k)
        this.db_data.splice(index, 1, r)

    };
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;