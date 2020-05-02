const mongoose = require('mongoose');
const Project = mongoose.model('projects');
const Image = mongoose.model('images');
const fs = require('fs');

module.exports = (app) => {
    app.get('/api/projects', async (req, res) => {
        const projects = await Project.find(req.body.constraints);
        console.log(projects);
        res.send(projects);
    });

    app.post('/api/projects', async (req, res) => {
        const path = "/Users/chengluo/Desktop/Life\ Code.png";
        const data = fs.readFileSync(path);

        const image = await new Image({
            title: "Life Code", // TODO
            binData: data // TODO
        }).save(async   function(err, img) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send("Could NOT save image file to database. ");
            } else {
                console.log(img);
                const project = await new Project({
                    title: req.body.title,
                    // author: req.user.id,
                    pubTime: Date.now(),
                    body: req.body.content,
                    imageId: img.id
                }).save(function(err, proj) {
                    if (err) {
                        console.log(err);
                        res.status(500);
                        res.send("Could NOT save project info to database. ");
                    } else {
                        res.status(200);
                        res.send({ proj, img });
                    }
                });
            }
        });
    });

};