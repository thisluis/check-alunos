import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyle';
import { Form } from './style';
import axios from '../../services/axios';
import history from '../../services/history';
import Loading from '../../components/Loading';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    let formErrors = false;

    if (nome.length < 3 || nome.length > 255) {
      formErrors = true;
      toast.error('Nomme deverá ter entra 3 e 255 caracteres');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail inválido');
    }

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Senha deverpa ter entre 6 e 50 caracteres');
    }

    if (formErrors) return;

    setLoading(true);

    try {
      await axios.post('/users/', {
        nome,
        password,
        email,
      });
      setLoading(false);
      toast.success('Cadastro realizado!');
      history.push('/login');
    } catch (err) {
      const errors = get(err, 'response.data.errors', []);

      errors.map((error) => toast.error(error));
      setLoading(false);
    }
  }

  return (
    <>
      <Container>
        <Loading isLoading={isLoading} />
        <h1>Crie sua conta</h1>
        <Form onSubmit={handleSubmit}>
          <label htmlFor="nome">
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </label>
          <label htmlFor="email">
            E-mail:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@hotmail.com"
              required
            />
          </label>
          <label htmlFor="senha">
            Senha:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua melhor senha"
              required
            />
          </label>
          <button type="submit">Criar minha conta</button>
        </Form>
      </Container>
    </>
  );
}