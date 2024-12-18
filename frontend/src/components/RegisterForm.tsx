import { X } from 'lucide-react';
import { useState } from 'react';
import * as z from 'zod';

type RegisterFormProps = {
  changeForm: () => void;
  closeAuthModal: () => void;
};

function RegisterForm({ changeForm, closeAuthModal }: RegisterFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password1: '',
    password2: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  // Zod schemas for validation
  const stepOneSchema = z.object({
    email: z.string().email('Invalid email address'),
    first_name: z.string().nonempty('First name is required'),
    last_name: z.string().nonempty('Last name is required'),
  });

  const stepTwoSchema = z
    .object({
      phone_number: z.string().nonempty('Phone number is required'),
      password1: z.string().nonempty('Password is required'),
      password2: z.string().nonempty('Password confirmation is required'),
    })
    .refine((data) => data.password1 === data.password2, {
      path: ['password2'],
      message: 'Passwords do not match',
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
    const result = stepTwoSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      // Handle form submission logic here
      console.log('Form submitted:', formData);
    } else {
        setErrors(result.error.flatten().fieldErrors);
    }
  };

  return (
    <form
      className="bg-white shadow-md w-[30%] rounded-xl"
      onSubmit={handleSubmit}
    >
      <div className="w-full bg-gray-100 flex justify-end border-b border-gray-300 rounded-t-xl">
        <button
          type="button"
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={closeAuthModal}
        >
          <X />
        </button>
      </div>
      <div className="px-8 pt-6 pb-8 mb-4">
        <div className="justify-center flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
          <p className="text-gray-700 text-sm mb-4">
            Register now and start reviewing restaurants!
          </p>
        </div>

        {step === 1 && (
          <>
            <div className="mb-4 mt-4">
              <label
                className="block text-gray-600 text-xs font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                aria-describedby="email_error"
              />
              <div className="min-h-[1.3rem] flex items-center">
                {errors.email && (
                  <p id="email_error" className="text-red-500 text-xs mt-1" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className="block text-gray-600 text-xs font-bold mb-2 mt-4"
                htmlFor="first_name"
              >
                First Name
              </label>
              <input
                className="border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light"
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleChange}
                aria-describedby="first_name_error"
              />
              <div className="min-h-[1.3rem] flex items-center">
                {errors.first_name && (
                  <p id="first_name_error" className="text-red-500 text-xs mt-1" role="alert">
                    {errors.first_name}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className="block text-gray-600 text-xs font-bold mb-2 mt-4"
                htmlFor="last_name"
              >
                Last Name
              </label>
              <input
                className="border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light"
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleChange}
                aria-describedby="last_name_error"
              />
              <div className="min-h-[1.3rem] flex items-center">
                {errors.last_name && (
                  <p id="last_name_error" className="text-red-500 text-xs mt-1" role="alert">
                    {errors.last_name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-center mt-4 w-full">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-6 w-1/2 rounded-2xl"
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
                className="block text-gray-600 text-xs font-bold mb-2"
                htmlFor="phone_number"
              >
                Phone Number
              </label>
              <input
                className="border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light"
                id="phone_number"
                name="phone_number"
                type="text"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                aria-describedby="phone_number_error"
              />
              <div className="min-h-[1.3rem] flex items-center">
                {errors.phone_number && (
                  <p id="phone_number_error" className="text-red-500 text-xs mt-1" role="alert">
                    {errors.phone_number}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className="block text-gray-600 text-xs font-bold mb-2 mt-4"
                htmlFor="password1"
              >
                Password
              </label>
              <input
                className="border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light"
                id="password1"
                name="password1"
                type="password"
                placeholder="Enter your password"
                value={formData.password1}
                onChange={handleChange}
                aria-describedby="password1_error"
              />
              <div className="min-h-[1.3rem] flex items-center">
                {errors.password1 && (
                  <p id="password1_error" className="text-red-500 text-xs mt-1" role="alert">
                    {errors.password1}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                className="block text-gray-600 text-xs font-bold mb-2 mt-4"
                htmlFor="password2"
              >
                Confirm Password
              </label>
              <input
                className="border-2 border-gray-100 rounded-lg w-full py-3 px-3 text-gray-700 focus:outline-none placeholder:font-light"
                id="password2"
                name="password2"
                type="password"
                placeholder="Confirm your password"
                value={formData.password2}
                onChange={handleChange}
                aria-describedby="password2_error"
              />
              <div className="min-h-[1.3rem] flex items-center">
                {errors.password2 && (
                  <p id="password2_error" className="text-red-500 text-xs mt-1" role="alert">
                    {errors.password2}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-4 w-full">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 mt-6 w-[45%] rounded-2xl"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 mt-6 w-[45%] rounded-2xl"
              >
                Register
              </button>
            </div>
          </>
        )}

        <div className="flex justify-center mt-6 text-sm">
          <p className="text-gray-600 text-center">Got an account?</p>
          <button
            type="button"
            className="text-red-500 hover:text-red-700 ml-2"
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