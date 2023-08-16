import { comparePassword, hashPassword } from "../helpers/authHelpers.js"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import JWt from "jsonwebtoken"

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        // Validation
        if (!name) {
            return res.send({ message: "Name is Required" })
        }
        if (!email) {
            return res.send({ message: "Email is Required" })
        }
        if (!password) {
            return res.send({ message: "Password is Required" })
        }
        if (!phone) {
            return res.send({ message: "Phone Number is Required" })
        }
        if (!address) {
            return res.send({ message: "Address is Required" })
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" })
        }

        // existing user

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login"
            })
        }

        // register user
        const hashedPassword = await hashPassword(password)

        // save

        const user = await new userModel({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            answer
        }).save()
        res.status(201).send({
            success: true,
            message: 'Register Succesfully',
            user
        })

    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            err
        })
    }
}


// Login Post

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            })
        }

        // check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registed"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        // token

        const token = await JWt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", })
        res.status(200).send({
            success: true,
            message: "login Successfuly",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Error in login",
            err
        })
    }
}

export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body
        if (!email) {
            res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            res.status(400).send({ message: "Answer is required" })
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" })
        }

        // check
        const user = await userModel.findOne({ email, answer })

        // Validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email Or Answer",
            })
        }
        const hashed = await hashPassword(newPassword)
        await userModel.findByIdAndUpdate(user._id, { password: hashed })
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            err
        })
    }
}

export const testController = (req, res) => {
    res.send("Protected Router")
}


// update

//update prfole
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated SUccessfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error WHile Update profile",
            error,
        });
    }
};

//orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//All orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error WHile Geting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};