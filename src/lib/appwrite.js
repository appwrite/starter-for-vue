import { Client, Account, Databases } from 'appwrite'

const getEndpoint = () => {
  return import.meta.env.VITE_APPWRITE_ENDPOINT
}

const getProjectId = () => {
  return import.meta.env.VITE_APPWRITE_PROJECT_ID
}

const getProjectName = () => {
  return import.meta.env.VITE_APPWRITE_PROJECT_NAME
}

const client = new Client().setEndpoint(getEndpoint()).setProject(getProjectId())

const account = new Account(client)
const databases = new Databases(client)

export { client, account, databases, getEndpoint, getProjectName, getProjectId }
