import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";

const GET_BALANCE = gql`
  query getBalance($username: String!) {
    Users(where: {username: {_eq: $username}}) {
      username
      Accounts {
        balance
      }
    }
  }
`;

const UPDATE_BALANCE = gql`
  mutation UpdateBalance($username: String!, $balance: Int!) {
    update_Accounts(where: {User: {username: {_eq: $username}}}, _set: {balance: $balance}) {
      affected_rows
    }
  }
`;

export default function Account() {
  const location = useLocation();
  const username = location.state?.userName;

  const [amountInput, setAmountInput] = useState('');
  const [balance, setBalance] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const { loading, error, data: userData, refetch } = useQuery(GET_BALANCE, {
    variables: { username },
    skip: !username,
  });

  const [updateAccount, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_BALANCE);

  useEffect(() => {
    if (userData && userData.Users && userData.Users[0] && userData.Users[0].Accounts) {
      setBalance(userData.Users[0].Accounts[0].balance);
    }
  }, [userData]);

  if (!username) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const submitDeposit = () => {
    setBalance(prevBalance => prevBalance + parseFloat(amountInput));
  };

  const submitWithdraw = () => {
    setBalance(prevBalance => prevBalance - parseFloat(amountInput));
  };

  const submitForm = async () => {
    try {
      const { data } = await updateAccount({
        variables: {
          username: username,
          balance: parseFloat(balance),
        },
      });
      console.log("Update result:", data);
      await refetch();
      if (data.update_Accounts.affected_rows > 0) {
        setSuccessMessage('Balance updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setSuccessMessage('No changes were made to the balance.');
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  const handlelogout = () => {
    location.state = null
    setSuccessMessage('Logging out...');
  }

  return (
    <div className="bg-green-400 h-screen w-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 text-center text-green-400 font-bold flex flex-col w-[80%] gap-6 items-center">
        <p className="text-lg">Welcome, {username}!</p>
        <p className="text-3xl">Balance: {balance}</p>
        {updateError && <p className="text-red-500">Update Error: {updateError.message}</p>}
        {successMessage && <p className="text-green-600">{successMessage}</p>}
        <hr className="bg-gray-500 h-1 rounded w-[80%] align-middle" />
        <div className="flex flex-col gap-6 items-center">
          <input
            type="number"
            className="p-2 rounded items-center"
            placeholder="Enter amount:"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
          <div className="flex items-center justify-center gap-20">
            <button onClick={submitDeposit} disabled={updateLoading}> Deposit </button>
            {balance > 0 && <button onClick={submitWithdraw} disabled={updateLoading}> Withdraw </button>}
          </div>
          <button
            className="bg-green-400 text-white font-extrabold hover:scale-110 transition"
            onClick={submitForm}
            disabled={updateLoading}
          >
            {updateLoading ? 'Updating...' : 'Confirm?'}
          </button>
          <button className="bg-red-600 text-white font-bold" onClick={handlelogout}> Logout </button>
        </div>
      </div>
    </div>
  );
}