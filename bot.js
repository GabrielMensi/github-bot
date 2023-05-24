const fs = require("fs");
const path = require("path");
const { Octokit } = require("@octokit/rest");

// Configura tu token de acceso personal de GitHub
const octokit = new Octokit({ auth: "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" });

// Configura los detalles de tu repositorio
const owner = "GabrielMensi";
const repo = "github-bot";
const filePath = "commits.json"; // Ruta del archivo que contiene los commits

// Función para hacer un commit y push
async function commitAndPush() {
  const timestamp = new Date().toISOString();

  try {
    // Lee el contenido actual del archivo
    const fullPath = path.join(__dirname, filePath);
    const commits = fs.existsSync(fullPath) ? JSON.parse(fs.readFileSync(fullPath)) : [];

    // Agrega la nueva fecha y hora al array de commits
    commits.push(timestamp);

    // Guarda el contenido actualizado en el archivo
    fs.writeFileSync(fullPath, JSON.stringify(commits));

    // Realiza el commit y el push utilizando la API de GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Daily commit - ${timestamp}`,
      content: Buffer.from(JSON.stringify(commits)).toString("base64"),
    });

    console.log("Commit realizado exitosamente.");

    // Realiza el push a la rama principal
    await octokit.git.createRef({
      owner,
      repo,
      ref: "refs/heads/main",
      sha: commits.length > 0 ? commits[commits.length - 1].sha : "", // SHA del último commit
    });

    console.log("Push realizado exitosamente.");
  } catch (error) {
    console.error("Ocurrió un error:", error.message);
  }
}

commitAndPush();
