# ** PROJECT DOCUMENTATION **

## ** SETUP INSTRUCTIONS **

### Backend Setup

#### Prerequisites

#### Installation

- [ ] Clone the repo : `git clone https://github.com/Overthinkr/fintech-next-hasuragraphql`
- [ ] Install dependancies : `pnpm i`
- [ ] Add .env file with variable 'VITE_APP_HASURA_ADMIN_SECRET' ='sjupE86CblBJAFSR7Y1wP6Pbtc29B8IlANX9OX9VRlm9wXhKt98XC2uZ4H1iYGx6'
- [ ] Run using : `vite`

## ** API DOCUMENTATION **

### Endpoint

https://subspace-intern.hasura.app/v1/graphql

### Tables

- Two tables : Users and Accounts was created to store user information and info on their accounts respectively
- Users columns : id (auto-generated), username, password, created_at (auto-generated)
- Accounts columns: id (auto-generated) , user_id (foreign key), balance, created_at (auto-generated)

### Queries Used

#### Get Users

````query GetUsers {
    Users {
      username
      password
    }
  }```

##### Sample Response:
```{
  "data": {
    "Users": [
      {
        "username": "mayank",
        "password": "mayank"
      },
      {
        "username": "subspace",
        "password": "subspace"
      }
    ]
  }
}```

#### Get Balance
```query getBalance($username: String!) {
    Users(where: {username: {_eq: $username}}) {
      username
      Accounts {
        balance
      }
    }
  }```

##### Sample Response
```{
  "data": {
    "Users": [
      {
        "username": "mayank",
        "Accounts": [
          {
            "balance": 500
          }
        ]
      }
    ]
  }
}```

### Mutations Used
#### Add Users
```query getBalance($username: String!) {
    Users(where: {username: {_eq: $username}}) {
      username
      Accounts {
        balance
      }
    }
  }```

#### Create Account
```query getBalance($username: String!) {
    Users(where: {username: {_eq: $username}}) {
      username
      Accounts {
        balance
      }
    }
  }```

#### Update Account
```mutation UpdateBalance($username: String!, $balance: Int!) {
    update_Accounts(where: {User: {username: {_eq: $username}}}, _set: {balance: $balance}) {
      affected_rows
    }
  }```

** MISC **
## Challenges, Tradeoffs and Limitations

- Figuring out the right way to use permissions and roles
- Tradeoff between Hasura actions and use of mutations with gql
- Fixing apollo client errors ended up being quite time consuming and needing more effort than expected
- (minor) Finding the right alternative for useEffect in context - usecallback
- (minor) learning graphql
- (minor) resolving react compenent hook issues
- Finding an alternative non- OAuth or firebase to complete in time (used local storage instead)
- Time limitations - Under 48 hours (due to college semester examinations (obviously no excuse however))
````
