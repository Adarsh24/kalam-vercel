import { AuthLayout } from "../components/AuthLayout";
import { Logo } from "../components/Logo";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { XCircleIcon } from '@heroicons/react/20/solid'

import { useAuth } from "../contexts/AuthContext";

function Register() {
    const initialValues = {
        email: "",
        password: ""
    };
    const { signIn } = useAuth()
    
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({...formValues, [name]: value});
    }

    let navigate = useNavigate(); 
    const redirectToHome = () =>{ 
        let path = `/home`; 
        navigate(path);
    }

    function validateForm() {
        const errors = {};
        
        const emailRegex = /^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$/
        if (formValues.email.length === 0) {
            errors.email = "Please enter your email";
        }else if (!emailRegex.test(formValues.email)) {
            errors.email = "Please enter valid email address";
        }
        
        if (formValues.password.length === 0) {
            errors.password = "Please enter the password";
        }else if (formValues.password.length < 8) {
            errors.password = "Password should be atleast 8 characters";
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        setIsSubmit(true);

        loginProcess();
    }

    async function loginProcess() {
        try {
            await signIn(formValues.email, formValues.password);
            // const user = userCredential.user;
            redirectToHome();
        } catch (error) {
            if (error.code == "auth/user-not-found" || error.code == "auth/wrong-password") {
                setAlertMessage("Incorrect login details. Please try again")
            }
            setIsSubmit(false)
        }
    }

    function SubmitButton() {
        return (
            <button onClick={validateForm} className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-pink-600 text-white hover:text-slate-100 hover:bg-pink-500 active:bg-pink-800 active:text-pink-100 focus-visible:outline-pink-600 w-full" type="submit">
                <span>Sign in <span aria-hidden="true">→</span></span>
            </button>
        );
    }
    
    function ProcessingButton() {
        return (
            <button className="group inline-flex items-center justify-center rounded-full cursor-not-allowed opacity-75 py-2 px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 bg-pink-600 text-white focus-visible:outline-pink-600 w-full" type="submit">
                <span>Processing</span>
            </button>
        );
    }

    function ActionButton() {
        if (isSubmit) {
            return <ProcessingButton />;
        }

        return <SubmitButton />;
    }

    function Alert() {
        if (alertMessage) {
            return (
                <div className="mt-5 -mb-5 rounded-md bg-red-50 p-4">
                    <div className="flex items-center gap-5">
                        <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                        <h3 className="text-sm font-medium text-red-800">{alertMessage}</h3>
                    </div>
                </div>
            );
        }

        return <></>
    }

    return (
        <>
            <AuthLayout>
                <div className="flex flex-col">
                    <a href="/" aria-label="Home">
                        <Logo className="h-10 w-auto" />
                    </a>
                    <div className="mt-20">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Sign in to your account
                        </h2>
                        <p className="mt-2 text-sm text-gray-700">
                            Don’t have an account?{' '}
                            <Link
                                to="/register"
                                className="font-medium text-pink-600 hover:underline"
                            >
                                Sign up
                            </Link>{' '}
                            to your account.
                        </p>
                    </div>
                </div>
                <Alert />
                <div className="mt-10 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
                    <div className="col-span-full">
                        <label htmlFor="email" className="mb-3 block text-sm font-medium text-gray-700">Email address</label>
                        <input 
                            id="email"
                            value={ formValues.email }
                            onChange={ handleChange }
                            onKeyUp={ handleChange }
                            type="email"
                            name="email"
                            autoComplete="email"
                            required=""
                            className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-pink-500 sm:text-sm"
                            data-ddg-inputtype="identities.emailAddress"
                            data-ddg-autofill="true" />
                        <div className="mt-1 text-sm text-red-500">{ formErrors.email }</div>
                    </div>
                    
                    <div className="col-span-full">
                        <label htmlFor="password" className="mb-3 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            value={ formValues.password }
                            onChange={ handleChange }
                            onKeyUp={ handleChange }
                            type="password"
                            name="password"
                            autoComplete="new-password"
                            required=""
                            className="block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-pink-500 focus:bg-white focus:outline-none focus:ring-pink-500 sm:text-sm"
                            data-ddg-inputtype="credentials.password" />
                        <div className="mt-1 text-sm text-red-500">{ formErrors.password }</div>
                    </div>
                    
                    <div className="col-span-full">
                        <ActionButton />
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}

export default Register