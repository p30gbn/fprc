import fetch from "node-fetch";
import { promises as fs ,createWriteStream} from "node:fs";
import { spawnSync,execSync,exec } from "node:child_process";
import {resolve,dirname,basename} from "path"
import {fileURLToPath} from "url";
const __dirname= dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
  "https://cdn-media-1.freecodecamp.org/images/1*I56pPhzO1VQw8SIsv8wYNA.png";

const dl = (async (url, path) => {
  const res = await fetch(url);
  const filestream = createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe(filestream);
    res.body.on("error", reject);
    filestream.on("finish", resolve);
  });
});

const term = ((command)=>{
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) reject(new Error(`error: ${error.message}`));

          if (stderr) reject(new Error(`stderr: ${stderr}`));
            resolve(stdout)
        });
    })
    
    
});



const main = (async () => {
    let links = await fs.readFile(resolve(__dirname, 'links.txt'),{encoding: 'utf8'});
    links = links.split(/\n/);
    term("docker container start aria2-ui");
    links.forEach((link)=>{
        (async()=>{
            await dl(link, resolve(__dirname, basename(decodeURI(link))));
            await term("unrar x " + basename(decodeURI(link)));
            await term(
              "docker exec aria2-ui rclone moveto data:/upload mega:/upload"
            );
        })(); 
        
    });
    await term('docker container kill aria2-ui');
})

main();
