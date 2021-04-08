import React from 'react';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  // useHistory,
  // useLocation
} from 'react-router-dom';

import SignUp from './auth/SignUp/SignUp';
import SignIn from './auth/SIgnIn/SignIn';

export interface AppRoute<P = any> {
  exact?: boolean;
  path: string;
  component: React.ComponentType<P>;
}

export interface AppProps { }

export interface AppState {
  user: any;
}

export class App extends React.Component<AppProps, AppState> {

  public static routes: AppRoute[] = [
    {
      exact: true,
      path: '/',
      component: () => <h1>Home</h1>
    },
    {
      path: '/sign-up',
      component: SignUp
    },
    {
      path: '/',
      component: SignIn
    },
    {
      path: '/',
      component: () => <h1>Private</h1>
    }
  ];

  // constructor(props: AppProps) {
  //   super(props);
  //   // this.state = {
  //   //   // TODO
  //   // };
  // }

  public async componentDidMount(): Promise<void> {
    try {
      const user = await Auth.currentAuthenticatedUser();
      if (user) {
        this.setState({ user });
      }
    } catch (error) { }
  }

  public renderOld(): React.ReactNode {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Hello from V2</h1>
        </header>
        <AmplifySignOut></AmplifySignOut>
      </div>
    );
  }

  public render(): React.ReactNode {
    return (
      <Router>
        <nav>
          <Link to="/">Home</Link>
          {!this.state?.user && <Link to="/sign-up">Sign Up</Link>}
          {!this.state?.user && <Link to="/sign-in">Sign In</Link>}
          {this.state?.user && <Link to="/private">Private</Link>}
        </nav>
        {this.state?.user && <button onClick={(event) => this.handleSignOut(event)}>Sign Out</button>}
        <Switch>
          <Route exact path="/">
            <h1>Home</h1>
          </Route>
          <Route path="/sign-up">
            <SignUp confirmed={(user) => { this.setState({ user }); }}></SignUp>
          </Route>
          <Route path="/sign-in">
            <SignIn confirmed={(user) => { this.setState({ user }); }}></SignIn>
          </Route>
          <Route path="/private" render={({ location }) => this.state?.user ? (
            <h1>Private</h1>
          ) : <Redirect to={{ pathname: 'sign-in', state: { from: location } }}></Redirect>}>
          </Route>
        </Switch>
      </Router>
    );
  }

  public async handleSignOut(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> {
    await Auth.signOut();
    window.location.reload();
  }

}

export const AppWithAuth = withAuthenticator(App);

export default App;
