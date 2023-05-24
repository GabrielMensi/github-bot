const { Octokit } = require("@octokit/rest");

// Configura tu token de acceso personal de GitHub
const octokit = new Octokit({ auth: "TU_TOKEN_DE_ACCESO_PERSONAL" });

// Configura los detalles de tu repositorio
const owner = "TU_NOMBRE_DE_USUARIO";
const repo = "TU_REPO";
const filePath = "commits.json"; // Ruta del archivo que contiene los commits

// Función para hacer un commit y push
async function commitAndPush() {
  const timestamp = new Date().toISOString();

  try {
    // Obtiene el contenido actual del archivo
    const { data: { content, sha } } = await octokit.repos.getContent({
      owner,
      repo,
      path: filePath,
    });

    // Decodifica y parsea el contenido del archivo como un array
    const commits = JSON.parse(Buffer.from(content, "base64").toString());

    // Agrega la nueva fecha y hora al array de commits
    commits.push(timestamp);

    // Codifica el array actualizado y lo convierte en contenido base64
    const updatedContent = Buffer.from(JSON.stringify(commits)).toString("base64");

    // Actualiza el archivo con el nuevo contenido
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: filePath,
      message: `Daily commit - ${timestamp}`,
      content: updatedContent,
      sha, // SHA del archivo actual
      committer: {
        name: "Tu Nombre",
        email: "tu@email.com",
      },
      author: {
        name: "Tu Nombre",
        email: "tu@email.com",
      },
    });

    console.log("Commit realizado exitosamente.");

    // Realiza el push a la rama principal
    await octokit.git.createRef({
      owner,
      repo,
      ref: "refs/heads/main",
      sha: sha, // SHA del último commit
    });

    console.log("Push realizado exitosamente.");
  } catch (error) {
    console.error("Ocurrió un error:", error.message);
  }
}

commitAndPush();