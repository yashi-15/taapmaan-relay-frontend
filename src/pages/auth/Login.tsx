import { useState } from "react"
import logo from "../../assets/logo.png"

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = () => {

    }

    return (
        <div className="flex flex-col h-screen justify-center bg-light">
            <div className="fixed top-0 p-6"><img src={logo} width={"90px"} /></div>
            <div className="flex justify-center items-center">
                <div className="w-70 sm:w-100">
                    <div className="my-8 mx-4">
                        <h1 className="text-center text-3xl sm:text-4xl font-bold mb-4">Welcome back</h1>
                        <p className="text-sm sm:text-base text-center">Welcome back! Please enter your details</p>
                    </div>
                    <div className="flex flex-col gap-3 w-[80%] mx-auto">
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} name="email" placeholder="Email" className="border border-primary rounded-md p-2 focus:outline-primary focus:outline-1" />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" placeholder="Password" className="border border-primary rounded-md p-2 focus:outline-primary focus:outline-1" />
                        <button onClick={handleSubmit} className="bg-primary text-white p-2 font-semibold rounded-full">
                            Log in
                        </button>
                    </div>
                    <div className="my-4">
                        <p className="text-sm sm:text-base text-center">
                            Don't have an account?{" "}
                                <span className="text-primary font-semibold">Sign up</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
