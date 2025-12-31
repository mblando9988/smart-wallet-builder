import { motion } from "framer-motion";
import { FileCode, Plus, Rocket, Shield, Coins, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = [
  {
    id: "erc20",
    name: "ERC-20 Token",
    description: "Create your own fungible token",
    icon: Coins,
    color: "from-primary to-accent",
  },
  {
    id: "erc721",
    name: "NFT Collection",
    description: "Launch an NFT collection",
    icon: Image,
    color: "from-accent to-success",
  },
  {
    id: "multisig",
    name: "Multisig Wallet",
    description: "Secure multi-signature wallet",
    icon: Shield,
    color: "from-warning to-destructive",
  },
];

export function ContractDeployer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Deploy Contracts</h2>
          <p className="text-sm text-muted-foreground">
            Deploy smart contracts with no code
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Custom
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4">
        {templates.map((template, index) => {
          const Icon = template.icon;
          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="gradient-border rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Deployments */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Recent Deployments
        </h3>
        <div className="glass rounded-xl p-4 text-center">
          <FileCode className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No contracts deployed yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Choose a template above to get started
          </p>
        </div>
      </div>
    </motion.div>
  );
}
