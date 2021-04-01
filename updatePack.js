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
            console.log("🚀 ~ file: updatePack.js ~ line 22 ~ i", i)
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
    // const dependencies = Object.keys(packageData.dependencies).removeArr('core-js', "shelljs", "vue", 'vue-server-renderer', 'vue-template-compiler')
    // // console.log("🚀 ~ file: updatePack.js ~ line 37 ~ main ~ dependencies", dependencies)
    // const updateDepString = "yarn upgrade " + dependencies.map(item => item).join(" ")//+ "@latest"
    // console.log("🚀 ~ file: updatePack.js ~ line 40 ~ main ~ updateDepString", updateDepString)
    // console.log("🚀 ~ file: updatePack.js ~ line 40 ~ main ~ updateDepString", updateDepString)
    // // console.log(updateDepString)
    const devDependencies = Object.keys(packageData.devDependencies).removeArr(["vue-server-renderer", "sass-loader", 'vue', 'vue-template-compiler', 'core-js', 'sass', 'deepmerge',
        'fibers',])
    console.log("🚀 ~ file: updatePack.js ~ line 44 ~ main ~ devDependencies", devDependencies)
    const updateDevDepString = "yarn upgrade " + devDependencies.map(item => item).join(" ") //+ " -D" // + "@latest"
    console.log("🚀 ~ file: updatePack.js ~ line 45 ~ main ~ updateDevDepString", updateDevDepString)
    //     console.log(updateDevDepString + " && " + updateDepString)

    //     shell.exec(updateDevDepString + " && " + updateDepString)
}
main()