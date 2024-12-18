import { X } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';

type LoginFormProps = {
  changeForm: () => void;
  closeAuthModal: () => void;
};

const LoginFormSchema = z.object({
  email: z
    .string({
    
      invalid_type_error: 'Invalid email address',
      required_error: 'Email is required',
    })
    .email('Invalid email address'),
  password: z.string({
    invalid_type_error: 'Invalid password',
    required_error: 'Password is required',
  }),
});

type ErrorType = {
  [key: string]: string[];
};

function LoginForm({ changeForm, closeAuthModal }: LoginFormProps) {
  const [errors, setErrors] = useState<ErrorType>({});
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validated_data = LoginFormSchema.safeParse({ email, password });
    if (!validated_data.success) {
      setErrors(validated_data.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    console.log('Form submitted', email, password);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className='bg-white shadow-md  w-[30%] rounded-3xl'
    >
      <div className='w-full bg-gray-50 flex justify-end border-b border-gray-200  rounded-t-3xl'>
        <button
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
        </div>
        <div className='mb-4 mt-4'>
          <label
            className='block text-gray-600 text-xs font-bold mb-2 '
            htmlFor='email'
          >
            Email
          </label>
          <input
            className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
            id='email'
            type='text'
            name='email'
            placeholder='Enter your email'
            aria-describedby='email-error'
          />
          <div className='h-[1.3rem]'>
            {errors.email && (
              <p className='text-red-500 text-xs' id='email-error' role='alert'>
                {errors.email}
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
          <button className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-6 w-1/2 rounded-2xl'>
            Login
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
