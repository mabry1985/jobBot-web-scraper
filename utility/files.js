function writeFiles(companyName, html) {
  const path = `./${companyName}.txt`

  try {
    if (fs.existsSync(path)) {
      const newPath = `./${companyName}-new.txt`
      fs.writeFileSync(newPath, html);
      compareFiles(path, newPath);
    } else
      fs.writeFileSync(path, html);
  } catch (err) {
    console.error(err)
  }
}

function compareFiles(file1, file2) {
  console.log(file1 === file1)
}