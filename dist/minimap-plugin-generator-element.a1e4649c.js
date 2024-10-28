var $5Xi1e$path = require("path");
var $5Xi1e$fsplus = require("fs-plus");
var $5Xi1e$atom = require("atom");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

      var $parcel$global = globalThis;
    var parcelRequire = $parcel$global["parcelRequire7d67"];
var parcelRegister = parcelRequire.register;
parcelRegister("1Ozz1", function(module, exports) {

$parcel$export(module.exports, "createMinimapPluginGeneratorElement", () => $15260c33b8bdf1f4$export$95d70a3925bf2f0c);

var $bN1tE = parcelRequire("bN1tE");




var $5yNMJ = parcelRequire("5yNMJ");

var $15260c33b8bdf1f4$var$$parcel$__dirname = $5Xi1e$path.resolve(__dirname, "../lib");
"use strict";
const $15260c33b8bdf1f4$var$TAG_NAME = "minimap-plugin-generator";
/** @access private */ class $15260c33b8bdf1f4$var$MinimapPluginGeneratorElement extends HTMLElement {
    static initClass() {
        this.registerCommands();
        (0, $5yNMJ.default)(this, $15260c33b8bdf1f4$var$TAG_NAME);
    }
    static registerCommands() {
        atom.commands.add("minimap-plugin-generator", {
            "core:confirm" () {
                this.confirm();
            },
            "core:cancel" () {
                this.detach();
            }
        });
    }
    createdCallback() {
        this.previouslyFocusedElement = null;
        this.mode = null;
        this.modal = document.createElement("atom-panel");
        this.modal.classList.add("minimap-plugin-generator");
        this.modal.classList.add("modal");
        this.modal.classList.add("overlay");
        this.modal.classList.add("from-top");
        this.editor = atom.workspace.buildTextEditor({
            mini: true
        });
        this.editorElement = atom.views.getView(this.editor);
        this.error = document.createElement("div");
        this.error.classList.add("error");
        this.message = document.createElement("div");
        this.message.classList.add("message");
        this.modal.appendChild(this.editorElement);
        this.modal.appendChild(this.error);
        this.modal.appendChild(this.message);
        this.appendChild(this.modal);
    }
    connectedCallback() {
        this.previouslyFocusedElement = document.activeElement;
        this.message.textContent = "Enter plugin path";
        this.setPathText("my-minimap-plugin");
        this.editorElement.focus();
    }
    attach() {
        atom.views.getView(atom.workspace).appendChild(this);
    }
    setPathText(placeholderName, rangeToSelect) {
        if (!rangeToSelect) rangeToSelect = [
            0,
            placeholderName.length
        ];
        const packagesDirectory = $15260c33b8bdf1f4$var$getPackagesDirectory();
        this.editor.setText((0, ($parcel$interopDefault($5Xi1e$path))).join(packagesDirectory, placeholderName));
        const pathLength = this.editor.getText().length;
        const endOfDirectoryIndex = pathLength - placeholderName.length;
        this.editor.setSelectedBufferRange([
            [
                0,
                endOfDirectoryIndex + rangeToSelect[0]
            ],
            [
                0,
                endOfDirectoryIndex + rangeToSelect[1]
            ]
        ]);
    }
    detach() {
        if (!this.parentNode) return;
        if (this.previouslyFocusedElement) this.previouslyFocusedElement.focus();
        this.parentNode.removeChild(this);
    }
    confirm() {
        if (this.validPackagePath()) {
            this.removeChild(this.modal);
            this.message.innerHTML = `
        <span class='loading loading-spinner-tiny inline-block'></span>
        Generate plugin at <span class="text-primary">${this.getPackagePath()}</span>
      `;
            this.createPackageFiles(()=>{
                const packagePath = this.getPackagePath();
                atom.open({
                    pathsToOpen: [
                        packagePath
                    ],
                    devMode: atom.config.get("minimap.createPluginInDevMode")
                });
                this.message.innerHTML = '<span class="text-success">Plugin successfully generated, opening it now...</span>';
                setTimeout(()=>{
                    this.detach();
                }, 2000);
            });
        }
    }
    getPackagePath() {
        const packagePath = this.editor.getText();
        const packageName = (0, $bN1tE.dasherize)((0, ($parcel$interopDefault($5Xi1e$path))).basename(packagePath));
        return (0, ($parcel$interopDefault($5Xi1e$path))).join((0, ($parcel$interopDefault($5Xi1e$path))).dirname(packagePath), packageName);
    }
    validPackagePath() {
        if ((0, $5Xi1e$fsplus.existsSync)(this.getPackagePath())) {
            this.error.textContent = `Path already exists at '${this.getPackagePath()}'`;
            this.error.style.display = "block";
            return false;
        } else return true;
    }
    initPackage(packagePath, callback) {
        const templatePath = (0, ($parcel$interopDefault($5Xi1e$path))).resolve($15260c33b8bdf1f4$var$$parcel$__dirname, (0, ($parcel$interopDefault($5Xi1e$path))).join("..", "templates", `plugin-${this.template}`));
        $15260c33b8bdf1f4$var$runCommand(atom.packages.getApmPath(), [
            "init",
            "-p",
            `${packagePath}`,
            "--template",
            templatePath
        ], callback);
    }
    createPackageFiles(callback) {
        const packagePath = this.getPackagePath();
        if ($15260c33b8bdf1f4$var$isStoredInDotAtom(packagePath)) this.initPackage(packagePath, ()=>{
            $15260c33b8bdf1f4$var$installPackage(packagePath, callback);
        });
        else this.initPackage(packagePath, ()=>{
            $15260c33b8bdf1f4$var$linkPackage(packagePath, ()=>{
                $15260c33b8bdf1f4$var$installPackage(packagePath, callback);
            });
        });
    }
}
$15260c33b8bdf1f4$var$MinimapPluginGeneratorElement.initClass();
function $15260c33b8bdf1f4$export$95d70a3925bf2f0c() {
    const element = document.createElement($15260c33b8bdf1f4$var$TAG_NAME);
    element.createdCallback();
    return element;
}
function $15260c33b8bdf1f4$var$linkPackage(packagePath, callback) {
    const args = [
        "link"
    ];
    if (atom.config.get("minimap.createPluginInDevMode")) args.push("--dev");
    args.push(packagePath.toString());
    $15260c33b8bdf1f4$var$runCommand(atom.packages.getApmPath(), args, callback);
}
function $15260c33b8bdf1f4$var$installPackage(packagePath, callback) {
    const args = [
        "install"
    ];
    $15260c33b8bdf1f4$var$runCommand(atom.packages.getApmPath(), args, callback, {
        cwd: packagePath
    });
}
function $15260c33b8bdf1f4$var$getPackagesDirectory() {
    return atom.config.get("core.projectHome") || process.env.ATOM_REPOS_HOME || (0, ($parcel$interopDefault($5Xi1e$path))).join((0, $5Xi1e$fsplus.getHomeDirectory)(), "github");
}
function $15260c33b8bdf1f4$var$isStoredInDotAtom(packagePath) {
    const packagesPath = (0, ($parcel$interopDefault($5Xi1e$path))).join(atom.getConfigDirPath(), "packages", (0, ($parcel$interopDefault($5Xi1e$path))).sep);
    if (packagePath.indexOf(packagesPath) === 0) return true;
    const devPackagesPath = (0, ($parcel$interopDefault($5Xi1e$path))).join(atom.getConfigDirPath(), "dev", "packages", (0, ($parcel$interopDefault($5Xi1e$path))).sep);
    return packagePath.indexOf(devPackagesPath) === 0;
}
function $15260c33b8bdf1f4$var$runCommand(command, args, exit, options = {}) {
    return new (0, $5Xi1e$atom.BufferedProcess)({
        command: command,
        args: args,
        exit: exit,
        options: options
    });
}

});


//# sourceMappingURL=minimap-plugin-generator-element.a1e4649c.js.map
