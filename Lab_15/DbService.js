const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

class DataBaseService {
    constructor() {
        this.url = 'mongodb+srv://admin:admin@cluster0.dkmge1d.mongodb.net/BSTU';
        this.client = new MongoClient(this.url);
        this.client = this.client.connect().then(connection => { return connection.db("BSTU") });
        console.log("Connected to MongoDB");
    }

    getAllByTableName(tableName) {
        return this.client.then(db => {
            return db.collection(tableName).find({}).toArray();
        });
    }

    getFaculty(fields) {
        return this.client
            .then(db => {
                return db.collection('faculty').findOne({ faculty: fields });
            })
            .then(record => {
                if (!record) throw 'There are no such records!';
                return record;
            });
    }
    getPulpit(fields) {
        return this.client
            .then(db => {
                return db.collection('pulpit').findOne({ pulpit: fields });
            })
            .then(record => {
                if (!record) throw 'There are no such records!';
                return record;
            });
    }
    getPulpitByFaculty(fields) {
        console.log(fields);
        return this.client
            .then(async db => {
                return await db.collection('pulpit').find({ faculty: fields }).toArray();
            })
            .then(record => {
                if (!record) 
                    throw 'There are no such records!';
                return record;
            });
    }

    insertField(tableName, fields) {
        return this.client
            .then(async db => {
                let pulpit = await db.collection(tableName).findOne(fields);
                console.log(pulpit);
                if (pulpit)
                    throw 'Record have already existed';
                await db.collection(tableName).insertOne(fields);
                return db.collection(tableName).findOne(fields);
            });
    }

    updateField(tableName, fields) {
        return this.client
            .then(async db => {
                console.log(fields);
                let record = tableName;
                if(tableName === 'faculty')
                    await db.collection(tableName).findOneAndUpdate({ faculty: fields.faculty },{ $set: fields })
                else if(tableName === 'pulpit')
                    await db.collection(tableName).findOneAndUpdate({ pulpit: fields.pulpit },{ $set: fields });
                else if(!record)
                    throw 'There is no such record!';
                return db.collection(tableName).findOne(fields);
            }
        );
    }

    deleteField(tableName, fields) {
        return this.client
            .then(async db => {
                console.log(fields);
                let record = tableName;
                if(tableName === 'faculty')
                    await db.collection(tableName).findOneAndDelete({ faculty: fields });
                else if(tableName === 'pulpit')
                    await db.collection(tableName).findOneAndDelete({ pulpit: fields });
                else if (!record)
                    throw 'There is no such record!';
                return record
            }
        );
    }
}
module.exports = new DataBaseService();