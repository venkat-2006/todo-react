import { useAuth } from '../context/AuthContext';

const { user, logout } = useAuth();

<button onClick={logout}>Logout</button>
