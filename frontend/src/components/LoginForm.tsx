import { LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { loginUser } from '../api/loginUser';
import { useUser } from '../contexts/userContext';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
type LoginFormProps = {
  changeForm: () => void;
  closeAuthModal: () => void;
};

const LoginFormSchema = z.object({
  username: z.string().nonempty("Username can't be empty"),
  password: z.string().nonempty("Password can't be empty"),
});

type ErrorType = {
  [key: string]: string[];
};

type ErrorResponse = {
  detail?: string[];
};

function LoginForm({ changeForm, closeAuthModal }: LoginFormProps) {
  const [errors, setErrors] = useState<ErrorType>({});
  const { setAccessToken } = useUser();
  const navigate = useNavigate();
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error?.response?.data?.detail) {
        setErrors({ detail: error.response.data.detail });
      } else {
        setErrors({ detail: ['Something went wrong'] });
      }
    },
    onSuccess: (data) => {
      setErrors({});
      closeAuthModal();
      setAccessToken(data.access);
      navigate('/protected');
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const validated_data = LoginFormSchema.safeParse({ username, password });

    if (!validated_data.success) {
      setErrors(validated_data.error.flatten().fieldErrors);
      return;
    }

    loginMutation.mutate({ username, password });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white shadow-md  w-[30%] rounded-3xl'
    >
      <div className='w-full bg-gray-50 flex justify-end border-b border-gray-200  rounded-t-3xl'>
        <button
          type='button'
          className='p-2 text-gray-500 hover:text-gray-700'
          onClick={closeAuthModal}
        >
          <X />
        </button>
      </div>
      <div className='px-8 pt-6 pb-8 mb-4'>
        <div className='justify-center flex flex-col items-center mb-8'>
          <h1 className='text-2xl font-bold text-center mb-4'>Login</h1>
          <p className='text-gray-700 text-sm mb-4'>
            Welcome back! Please login to your account.
          </p>
          {errors?.detail && (
            <p className='text-red-500 text-xs' role='alert'>
              {errors.detail}
            </p>
          )}
        </div>
        <div className='mb-4 mt-4'>
          <label
            className='block text-gray-600 text-xs font-bold mb-2 '
            htmlFor='username'
          >
            Username
          </label>
          <input
            className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
            id='username'
            type='text'
            name='username'
            placeholder='Enter your username'
            aria-describedby='username-error'
          />
          <div className='h-[1.3rem]'>
            {errors.username && (
              <p
                className='text-red-500 text-xs'
                id='username-error'
                role='alert'
              >
                {errors.username}
              </p>
            )}
          </div>
        </div>
        <div>
          <label
            className='block text-gray-600 text-xs font-bold mb-2 mt-4'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
            id='password'
            type='password'
            name='password'
            placeholder='Enter Your Password'
            aria-describedby='password-error'
          />
          <div className='h-[1.3rem]'>
            {errors.password && (
              <p
                className='text-red-500 text-xs'
                id='password-error'
                role='alert'
              >
                {errors.password}
              </p>
            )}
          </div>
        </div>
        <div className='flex justify-center mt-4 w-full'>
          <button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-6 w-1/2 rounded-2xl focus:outline-none flex justify-center'>
            {loginMutation.isPending ? (
              <LoaderCircle className='animate-spin' />
            ) : (
              'Login'
            )}
          </button>
        </div>
        <div className='flex justify-center mt-6 text-sm'>
          <p className=' text-gray-600  text-center '>New to ReserveNrate?</p>
          <button
            className='text-red-500 hover:text-red-700 ml-2'
            onClick={changeForm}
          >
            Register
          </button>
        </div>
      </div>
    </form>
  );
}

export default LoginForm;
