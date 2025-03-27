import fs from "fs";
import path from "path";

class GlobalConfig {
  private static instance: GlobalConfig;
  public readonly cacheDir: string;

  private constructor() {
		// raiz do projeto
    this.cacheDir = path.join(__dirname, ".cache");
    
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir);
    }
  }

  static getInstance(): GlobalConfig {
    if (!GlobalConfig.instance) {
      GlobalConfig.instance = new GlobalConfig();
    }
    return GlobalConfig.instance;
  }
}

// Exporta a instância global da configuração
export const globalConfig = GlobalConfig.getInstance();
