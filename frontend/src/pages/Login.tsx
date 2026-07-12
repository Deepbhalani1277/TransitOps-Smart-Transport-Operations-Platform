import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-panel p-8 rounded-lg border border-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-accent">
            Sign in to TransitOps
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Smart Transport Operations Platform
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <input
              type="email"
              placeholder="Email address"
              className="relative block w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-gray-300 placeholder-gray-500 focus:z-10 focus:border-accent focus:outline-none sm:text-sm"
            />
            <input
              type="password"
              placeholder="Password"
              className="relative block w-full rounded-md border border-gray-800 bg-bg px-3 py-2 text-gray-300 placeholder-gray-500 focus:z-10 focus:border-accent focus:outline-none sm:text-sm"
            />
          </div>
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white hover:bg-amber-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
