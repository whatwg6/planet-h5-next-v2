import "@/shared/styles/global.css";
import { mountApp } from "@/app/bootstrap/mountApp";

const root = document.getElementById("root");
if (!root) throw new Error("找不到应用挂载节点 #root");
mountApp(root);
