import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { login } from '../actions/userActions';
import FormContainer from '../components/FormContainer';

const LoginScreen = (props) => {
  const { history, location } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
    return () => {
      //
    };
  }, [history, userInfo, redirect]);

  const responseFacebook = (dataResponse) => {
    console.log(dataResponse);
  };

  const responseGoogle = (dataResponse) => {
    console.log(dataResponse);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' block>
          Continue
        </Button>
      </Form>

      <Row>
        <Col>
          <p className='text-center my-3'>or Connect With Social Media</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <FacebookLogin
            appId='231911432117995'
            cssClass='btn__social btn__facebook'
            textButton='Login With Facebook'
            fields='name,email,picture'
            callback={responseFacebook}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <GoogleLogin
            clientId='345201133892-pmeecrimpngn094rtio9jjisl8hon28r.apps.googleusercontent.com'
            render={(renderProps) => (
              <button
                className='btn__social btn__google'
                onClick={renderProps.onClick}
              >
                Login With Google
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
          />
        </Col>
      </Row>

      <Row className='mt-3 py-2'>
        <Col>
          New Customer ?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : `/register`}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
