import React from 'react';
import './SignIn.css';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

// export enum SignInUIState {
//   SignIn,
//   ConfirmSignIn
// }

export interface SignInState {
  // uiState: SignInUIState;
}

export interface SignInProps {
  confirmed: (user: CognitoUser) => void;
}

export class SignIn extends React.Component<SignInProps, SignInState> {

  private user?: CognitoUser;

  // constructor(props: SignInProps) {
  //   super(props);
  //   this.state = {
  //     uiState: SignInUIState.SignIn
  //   };
  // }

  public render(): React.ReactNode {
    return (
      <form onSubmit={(event) => this.handleSignInSubmit(event)}>
        <label>
          Username:
          <input type="text" name="username" required />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
    );
  }

  public handleSignInSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const form = event.currentTarget;
    const [username, password] = ['username', 'password'].map(key => {
      return (form.elements[key as any] as HTMLInputElement).value;
    });
    this.signIn(username, password);
    event.preventDefault();
  }

  private async signIn(username: string, password: string): Promise<void> {
    try {
      const user = await Auth.signIn(username, password);
      this.user = user;
      this.props.confirmed(this.user!);
    } catch (error) {
      console.log('error signing in', error);
    }
  }

}

export default SignIn;
