import Task from "../models/task.js";
import { encryptText, decryptText } from "../utils/cryptoUtil.js";

// create task
export const createTask = async (req, res)=> {
    try {
        const { title, description } = req.body;
        
        if(!title){
            return res.status(400). json({ message: "Title is required"});
        }
        const encryptedDescription = description
  ? encryptText(description)
  : "";

const task = await Task.create({
  title,
  description: encryptedDescription,
  user: req.user._id
});
        res.status(201).json({
            message: "Task created successfully",
            task
        });
    }
    catch(error){
        res.status(500).json({ message: error.message});
    }
};

export const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 5 , status, search} = req.query;
        const query = { user: req.user._id};

        if(status){ query.status = status;
        }
        if (search){
            query.title = { $regex: search, $options: "i"};
        }
        const tasks = await Task.find(query)
        .skip((page-1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1});

        const total = await Task.countDocuments(query);
        const decryptedTasks = tasks.map(task => {
            const taskObj = task.toObject();
            if(taskObj.description){
                try {
                    taskObj.description = decryptText(taskObj.description);
                }
                catch(error){
                    taskObj.description = "Description failed";
                }
            }
            return taskObj;
        });
        res.status(200).json({
            total,
            page:Number(page),
            tasks:decryptedTasks
        });
    } catch(error){
        return res.status(500). json({ message: error.message});
    }
};

export const updateTask = async(req, res) =>{
    try {
        const { id } = req.params;
        const { title, description, status } = req.body || {};

        const task = await Task.findOne({
            _id: id,
            user: req.user._id
        });

          if(!task){
            return res.status(404). json({ message: " Task not found"});
        }
        if(title!== undefined) task.title = title;
        if(description!==undefined) task.description = description;
        if(status!==undefined) task.status =status;
         await task.save();

         res.status(200).json({
            message:" Task updated successfully",
            task
         })


    } catch(error){
        return res.status(500). json({ message: error.message});
    }
};

  export const deleteTask = async(req, res)=>{
    try{
        const { id } = req.params;
        const task  = await Task.findOneAndDelete({
            _id: id,
            user: req.user._id
        });
        if(!task){
            return res.status(404). json({ message: "Task not found"});
        }
        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch(error){
        return res.status(500). json({ message: error.message});
    }
};