import { HashRouter as BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import AppLayout from './components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Themes from './pages/Themes'
import Tags from './pages/Tags'
import Messages from './pages/Messages'
import MessageComposer from './pages/MessageComposer'
import Forms from './pages/Forms'
import FormBuilderPage from './pages/FormBuilderPage'
import FormPublic from './pages/FormPublic'
import Alarms from './pages/Alarms'
import AlarmEditorPage from './pages/AlarmEditorPage'
import SendLogs from './pages/SendLogs'
import { useAuth } from './hooks/useAuth'
import { Loader2 } from 'lucide-react'

function LoadingScreen() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <Loader2 size={32} className="animate-spin text-brand-400" />
        </div>
    )
}

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <LoadingScreen />
    if (!user) return <Navigate to="/login" replace />
    return children
}

function PublicRoute({ children }) {
    const { user, loading } = useAuth()
    if (loading) return <LoadingScreen />
    if (user) return <Navigate to="/" replace />
    return children
}

export default function App() {
    return (
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                        <Route path="/f/:slug" element={<FormPublic />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <AppLayout />
                            </ProtectedRoute>
                        }>
                            <Route index element={<Dashboard />} />
                            <Route path="contacts" element={<Contacts />} />
                            <Route path="themes" element={<Themes />} />
                            <Route path="tags" element={<Tags />} />
                            <Route path="messages" element={<Messages />} />
                            <Route path="send" element={<MessageComposer />} />
                            <Route path="forms" element={<Forms />} />
                            <Route path="forms/new" element={<FormBuilderPage />} />
                            <Route path="forms/:id/edit" element={<FormBuilderPage />} />
                            <Route path="alarms" element={<Alarms />} />
                            <Route path="alarms/new" element={<AlarmEditorPage />} />
                            <Route path="alarms/:id/edit" element={<AlarmEditorPage />} />
                            <Route path="logs" element={<SendLogs />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    )
}
