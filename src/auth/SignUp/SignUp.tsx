import React from 'react';
import './SignUp.css';
import { Auth } from 'aws-amplify';
import { CognitoUser } from 'amazon-cognito-identity-js';

export enum SignUpUIState {
  SignUp,
  ConfirmSignUp
}

export interface SignUpState {
  uiState: SignUpUIState;
}

export interface SignUpProps {
  confirmed: (user: CognitoUser) => void;
}

export class SignUp extends React.Component<SignUpProps, SignUpState> {

  private user?: CognitoUser;

  constructor(props: SignUpProps) {
    super(props);
    this.state = {
      uiState: SignUpUIState.SignUp
    };
  }

  public render(): React.ReactNode {
    switch (this.state?.uiState) {
      case SignUpUIState.ConfirmSignUp: {
        return (
          <form onSubmit={(event) => this.handleConfirmSignUpSubmit(event)}>
            <label>
              Code:
              <input type="text" name="code" required />
            </label>
            <br />
            <button type="button" onClick={(event) => this.resendConfirmationCode()}>Resend Code</button>
            <button type="submit">Confirm</button>
          </form>
        );
      }
      case SignUpUIState.SignUp:
      default: {
        return (
          <form className="SignUp-form" onSubmit={(event) => this.handleSignUpSubmit(event)}>
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
            <label>
              Email:
              <input type="email" name="email" />
            </label>
            <br />
            <label>
              Phone:
              <input type="tel" name="phone_number" />
            </label>
            <br />
            <button type="submit">Sign Up</button>
          </form>
        );
      }
    };
  }

  public handleSignUpSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const form = event.currentTarget;
    const [username, password, email, phone_number] = ['username', 'password', 'email', 'phone_number'].map(key => {
      return (form.elements[key as any] as HTMLInputElement).value;
    });
    this.signUp(username, password, email, phone_number);
    event.preventDefault();
  }

  public handleConfirmSignUpSubmit(event: React.FormEvent<HTMLFormElement>): void {
    const form = event.currentTarget;
    const code = (form.elements['code' as any] as HTMLInputElement).value;
    this.confirmSignUp(code);
    event.preventDefault();
  }

  private async signUp(username: string, password: string, email: string, phone_number: string): Promise<void> {
    try {
      const { user, userConfirmed } = await Auth.signUp({
        username,
        password,
        attributes: {
          email,          // optional
          phone_number,   // optional - E.164 number convention
          // other custom attributes 
        }
      });
      this.user = user;
      if (userConfirmed) {
        this.props.confirmed(this.user);
      } else {
        this.setState({
          uiState: SignUpUIState.ConfirmSignUp,
        });
      }
      console.log(user);
    } catch (error) {
      console.log('error signing up:', error);
    }
  }

  private async confirmSignUp(code: string): Promise<void> {
    const username = this.user!.getUsername();
    try {
      await Auth.confirmSignUp(username, code);
      this.props.confirmed(this.user!);
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  }

  private async resendConfirmationCode(): Promise<void> {
    const username = this.user!.getUsername();
    try {
      await Auth.resendSignUp(username);
      console.log('code resent successfully');
    } catch (err) {
      console.log('error resending code: ', err);
    }
  }

}

export default SignUp;
