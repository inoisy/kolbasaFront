const fs = require("fs")
const shell = require('shelljs');

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele != value;
    });
}
Array.prototype.removeArr = function (val) {
    if (!val) {
        return this
    }
    // console.log("val: ", val)
    // console.log("this: ", this)
    if (Array.isArray(val)) {
        val.forEach(item => {
            // console.log("🚀 ~ file: updatePack.js ~ line 15 ~ item", item)
            // console.log(this.findIndex(it => it === item))

            const i = this.findIndex(it => it === item)
            if (i) {
                this.splice(i, 1);
            }

        })
        return this
    }
    return this.filter(function (ele) {
        return ele != val;
    });
}

async function main() {
    const packageData = JSON.parse(await fs.readFileSync("./package.json"))
    const dependencies = Object.keys(packageData.dependencies).removeArr('core-js', "shelljs")
    // console.log("🚀 ~ file: updatePack.js ~ line 37 ~ main ~ dependencies", dependencies)
    const updateDepString = "yarn add " + dependencies.map(item => item + "@latest").join(" ")
    // console.log(updateDepString)
    const devDependencies = Object.keys(packageData.devDependencies).removeArr(["sass-loader", 'vue', 'vue-template-compiler'])
    const updateDevDepString = "yarn add " + devDependencies.map(item => item + "@latest").join(" ") + " -D"
    console.log(updateDevDepString + " && " + updateDepString)

    shell.exec(updateDevDepString + " && " + updateDepString)
}
main()