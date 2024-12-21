import { X } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/registerUser';
import { AxiosError } from 'axios';
import { loginUser } from '../api/loginUser';
import { useNavigate } from 'react-router';
import { useUser } from '../contexts/userContext';

type RegisterFormProps = {
  changeForm: () => void;
  closeAuthModal: () => void;
};

const stepOneSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().nonempty('Username is required'),
  first_name: z.string().nonempty('First name is required'),
  last_name: z.string().nonempty('Last name is required'),
});

const stepTwoSchema = z
  .object({
    phone_number: z.string().nonempty('Phone number is required'),
    password: z.string().nonempty('Password is required'),
    password2: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.password2, {
    path: ['password2'],
    message: 'Passwords do not match',
  });

function RegisterForm({ changeForm, closeAuthModal }: RegisterFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    username: '',
    phone_number: '',
    password: '',
    password2: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();
  const { setAccessToken } = useUser();
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onError: (error: AxiosError) => {
      if (error.response?.data) {
        setErrors({ ...error.response.data });
      } else {
        setErrors({ non_field_errors: ['Something went wrong'] });
      }
    },
    onSuccess: async () => {
      setErrors({});
      try {
        const data = await loginUser({
          username: formData.username,
          password: formData.password,
        });
        setAccessToken(data.access);
        closeAuthModal();
        navigate('/protected');
      } catch (error) {
        console.error(error);
        changeForm();
      }
    },
  });

  const handleNext = () => {
    const validated_data = stepOneSchema.safeParse(formData);
    if (validated_data.success) {
      setErrors({});
      setStep(2);
    } else {
      setErrors(validated_data.error.flatten().fieldErrors);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const step1Result = stepOneSchema.safeParse(formData);
    const step2Result = stepTwoSchema.safeParse(formData);

    if (!step1Result.success) {
      setErrors({ non_field_errors: ['Please complete step 1'] });
      return;
    }

    if (!step2Result.success) {
      setErrors(step2Result.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    registerMutation.mutate(formData);
  };

  return (
    <form
      className='bg-white shadow-md w-[30%] rounded-xl'
      onSubmit={handleSubmit}
    >
      <div className='w-full bg-gray-100 flex justify-end border-b border-gray-300 rounded-t-xl'>
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
          <h1 className='text-2xl font-bold text-center mb-4'>Register</h1>
          <p className='text-gray-700 text-sm mb-4'>
            Register now and start reviewing restaurants!
          </p>
          {errors.non_field_errors && (
            <p className='text-red-500 text-sm mt-1' role='alert'>
              {errors.non_field_errors[0]}
            </p>
          )}
        </div>

        {step === 1 && (
          <>
            <div className='mb-4 mt-4'>
              <label
                className='block text-gray-600 text-xs font-bold mb-2'
                htmlFor='email'
              >
                Email
              </label>
              <input
                className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
                id='email'
                name='email'
                type='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleChange}
                aria-describedby='email_error'
              />
              <div className='min-h-[1.3rem] flex items-center'>
                {errors.email && (
                  <p
                    id='email_error'
                    className='text-red-500 text-xs mt-1'
                    role='alert'
                  >
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className='block text-gray-600 text-xs font-bold mb-2 mt-4'
                htmlFor='username'
              >
                Username
              </label>
              <input
                className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
                id='username'
                name='username'
                type='text'
                placeholder='Enter your username'
                value={formData.username}
                onChange={handleChange}
                aria-describedby='username_error'
              />
              <div className='min-h-[1.3rem] flex items-center'>
                {errors.username && (
                  <p
                    id='username_error'
                    className='text-red-500 text-xs mt-1'
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
                htmlFor='first_name'
              >
                First Name
              </label>
              <input
                className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
                id='first_name'
                name='first_name'
                type='text'
                placeholder='Enter your first name'
                value={formData.first_name}
                onChange={handleChange}
                aria-describedby='first_name_error'
              />
              <div className='min-h-[1.3rem] flex items-center'>
                {errors.first_name && (
                  <p
                    id='first_name_error'
                    className='text-red-500 text-xs mt-1'
                    role='alert'
                  >
                    {errors.first_name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className='block text-gray-600 text-xs font-bold mb-2 mt-4'
                htmlFor='last_name'
              >
                Last Name
              </label>
              <input
                className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
                id='last_name'
                name='last_name'
                type='text'
                placeholder='Enter your last name'
                value={formData.last_name}
                onChange={handleChange}
                aria-describedby='last_name_error'
              />
              <div className='min-h-[1.3rem] flex items-center'>
                {errors.last_name && (
                  <p
                    id='last_name_error'
                    className='text-red-500 text-xs mt-1'
                    role='alert'
                  >
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>
            <div className='flex justify-center mt-4 w-full'>
              <button
                type='button'
                className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-6 w-1/2 rounded-2xl'
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label
                className='block text-gray-600 text-xs font-bold mb-2'
                htmlFor='phone_number'
              >
                Phone Number
              </label>
              <input
                className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
                id='phone_number'
                name='phone_number'
                type='text'
                placeholder='Enter your phone number'
                value={formData.phone_number}
                onChange={handleChange}
                aria-describedby='phone_number_error'
              />
              <div className='min-h-[1.3rem] flex items-center'>
                {errors.phone_number && (
                  <p
                    id='phone_number_error'
                    className='text-red-500 text-xs mt-1'
                    role='alert'
                  >
                    {errors.phone_number}
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
                name='password'
                type='password'
                placeholder='Enter your password'
                value={formData.password}
                onChange={handleChange}
                aria-describedby='password_error'
              />
              <div className='min-h-[1.3rem] flex items-center'>
                {errors.password && (
                  <p
                    id='password_error'
                    className='text-red-500 text-xs mt-1'
                    role='alert'
                  >
                    {errors.password[0]}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className='block text-gray-600 text-xs font-bold mb-2 mt-4'
                htmlFor='password2'
              >
                Confirm Password
              </label>
              <input
                className='border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light'
                id='password2'
                name='password2'
                type='password'
                placeholder='Confirm your password'
                value={formData.password2}
                onChange={handleChange}
                aria-describedby='password2_error'
              />
              <div className='min-h-[1.3rem] flex items-center'>
                {errors.password2 && (
                  <p
                    id='password2_error'
                    className='text-red-500 text-xs mt-1'
                    role='alert'
                  >
                    {errors.password2[0]}
                  </p>
                )}
              </div>
            </div>
            <div className='flex justify-between mt-4 w-full'>
              <button
                type='button'
                className='bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 mt-6 w-[45%] rounded-2xl'
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type='submit'
                className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-6 w-[45%] rounded-2xl'
              >
                Register
              </button>
            </div>
          </>
        )}

        <div className='flex justify-center mt-6 text-sm'>
          <p className='text-gray-600 text-center'>Got an account?</p>
          <button
            type='button'
            className='text-red-500 hover:text-red-700 ml-2'
            onClick={changeForm}
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;
