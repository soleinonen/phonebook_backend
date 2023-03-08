const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('data', (req)=>{
    if (req.method==='POST'){
        return JSON.stringify(req.body)
    }
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`
        <div>Phonebook has info for ${persons.length} people</div>
        <div>${new Date}</div>
        `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id===id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id!==id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name || !body.number) {
        res.status(400).json({error: 'name or number missing'}).end()
        return
    }

    if (persons.find(person => body.name===person.name)) {
        res.status(400).json({error: 'name must be unique'}).end()
        return
    }

    const person = {
        id: Math.floor(Math.random()*10000),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})