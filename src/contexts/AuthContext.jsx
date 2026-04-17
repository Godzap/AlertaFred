import { createContext, useContext, useState, useEffect } from 'react'
import { mockUser } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verifica se há sessão salva no localStorage (mock)
        const saved = localStorage.getItem('zapcrm_session')
        if (saved) {
            setUser(JSON.parse(saved))
        }
        setLoading(false)
    }, [])

    const signIn = async ({ email, password }) => {
        // Mock: aceita qualquer credencial
        await new Promise(r => setTimeout(r, 800))
        const u = { ...mockUser, email }
        localStorage.setItem('zapcrm_session', JSON.stringify(u))
        setUser(u)
        return { error: null }
    }

    const signUp = async ({ email, password, full_name }) => {
        await new Promise(r => setTimeout(r, 800))
        const u = { ...mockUser, email, user_metadata: { full_name } }
        localStorage.setItem('zapcrm_session', JSON.stringify(u))
        setUser(u)
        return { error: null }
    }

    const signOut = () => {
        localStorage.removeItem('zapcrm_session')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext }
