import { gql, useQuery, useMutation } from "@apollo/client";
import { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';


const GET_USERS = gql`
  query GetUsers {
    Users {
      username
      password
    }
  }
`;

const ADD_USER = gql`
  mutation AddUser($username: String!, $password: String!) {
    insert_Users(objects: { username: $username, password: $password }) {
      returning {
        id
      }
    }
  }
`;

const ADD_ACCOUNT = gql`
  mutation AddAccount($userId: Int!) {
    insert_Accounts(objects: {user_id: $userId}) {
      returning {
        id
      }
    }
  }
`;


export default function Landing() {

    const navigate = useNavigate();

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [newUser, setNewUser] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [addUser] = useMutation(ADD_USER);
    const [addAccount] = useMutation(ADD_ACCOUNT);
    const { data: userData } = useQuery(GET_USERS);

    const validateInput = useCallback(() => {
        if (!userName.trim() || !userPassword.trim()) {
            setErrorMessage('Username and password are required');
            return false;
        }
        setErrorMessage('');
        return true;
    }, [userName, userPassword]);

    const handleSubmitRegistration = useCallback(async (e) => {
        e.preventDefault();
        if (!validateInput()) return;

        try {
            const { data: userData } = await addUser({
                variables: { username: userName, password: userPassword },
            });
            const userId = userData?.insert_Users?.returning[0]?.id;
            if (userId) {
                const { data: accountData } = await addAccount({
                    variables: { userId }
                });
                if (accountData?.insert_Accounts?.returning[0]?.id) {
                    setErrorMessage('User and account created successfully');
                    setNewUser(false);
                } else {
                    throw new Error('Failed to create account');
                }
            } else {
                throw new Error('Failed to create user');
            }
        } catch (error) {
            setErrorMessage(`Error: ${error.message}`);
        }
    }, [addUser, addAccount, userName, userPassword, validateInput]);

    const handleSubmitLogin = useCallback((e) => {
        e.preventDefault();
        if (!validateInput()) return;

        const user = userData?.Users?.find(
            (user) => user.username === userName && user.password === userPassword
        );

        if (user) {
            navigate('/account', { state: { userName } })
        } else {
            setErrorMessage('Invalid username or password');
        }
    }, [userData, userName, userPassword, validateInput, navigate]);

    return (
        <div className="bg-green-400 h-screen w-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded-lg p-8 text-center text-green-400 font-bold flex">
                <div className="flex flex-col gap-6">
                    <h3 className="text-red-400">{newUser ? 'New User? Sign Up here' : 'Existing Users, login here'}</h3>
                    <form className="space-y-4 flex flex-col" onSubmit={newUser ? handleSubmitRegistration : handleSubmitLogin}>
                        <input
                            type="text"
                            className="p-2 rounded"
                            placeholder="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                            type="password"
                            className="p-2 rounded"
                            placeholder="password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                        />
                        <button className="bg-green-400 text-white p-2 rounded">
                            {newUser ? 'Sign Up' : 'Login'}
                        </button>
                    </form>
                    <p className="cursor-pointer" onClick={() => setNewUser(!newUser)}>
                        {newUser ? 'Existing User?' : 'New User?'}
                    </p>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}