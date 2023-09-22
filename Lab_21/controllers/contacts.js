const fs = require('fs');

const regexContact = /^(\S+\s+\S+)\s+(\d+)$/;

const readContacts = async (req, res) => {
    const file = fs.readFileSync('./contacts.json', 'utf-8');
    return JSON.parse(file);
}; 

const writeContacts = async (contacts) => {
    await fs.writeFile('./contacts.json', JSON.stringify(contacts), () => {
        console.log('Wrote to file.')
    });
}


   const getIndex = async (req, res) => {
        const contacts = await readContacts();
        res.render('home', { contacts });
    }
    
    const getAdd = async (req, res) => {
        const contacts = await readContacts();
        res.render('add', { contacts, /*deny: true,*/ add: true });
    }
    
    const postAdd = async (req, res) => {
        const string = req.body.contact;
        if (!RegExp(regexContact).test(string)) {
            res.status(400).send('Invalid contact format');
            return;
        }
        const [name, phone] = string.match(regexContact).slice(1);
    
        const contacts = await readContacts();
        contacts.push({name: name, phone: phone});
        await writeContacts(contacts);
    
        res.render('home', { contacts });
    }
    
    const getUpdate = async (req, res) => {
        const contacts = await readContacts();
        res.render('update', { contacts, name: req.query.name, phone: req.query.phone, /*deny: true,*/ update: true });
    }
    
    const postUpdate = async (req, res) => {
        const { newContact, oldContact } = req.body;
        
        if (!RegExp(regexContact).test(newContact)) {
            res.status(400).send('Invalid contact format');
            return;
        }
    
        const [oldName, oldPhone] = oldContact.match(regexContact).slice(1);
        const [newName, newPhone] = newContact.match(regexContact).slice(1);
    
        const contacts = await readContacts();
        const index = contacts.findIndex(c => c.name === oldName && c.phone === oldPhone);
    
        contacts[index] = {name: newName, phone: newPhone};
        await writeContacts(contacts);
    
        res.render('home', { contacts });
    }
    
    const postDelete = async (req, res) => {
        const string = req.body.contact;
        const [name, phone] = string.match(regexContact).slice(1);
    
        const contacts = await readContacts();
        const index = contacts.findIndex(c => c.name === name && c.phone === phone);
    
        contacts.splice(index, 1);
        await writeContacts(contacts);
    
        res.render('home', { contacts });
    }    

module.exports = {
    getIndex,
    getAdd,
    postAdd,
    getUpdate,
    postUpdate,
    postDelete
}