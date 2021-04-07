import nc from 'next-connect'
import authenticated from './get-token'
import mongodb from './mongodb'

const all = nc()

all.use(authenticated).use(mongodb)

export default all;