"use client";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ───────────────────────── Types ───────────────────────── */
type Block =
  | { t: "p"; v: string }
  | { t: "h"; v: string }
  | { t: "ul" | "ol"; v: string[] }
  | { t: "code"; v: string; lang?: string }
  | { t: "note"; v: string; kind?: "note" | "warn" | "tip" }
  | {
      t: "tabs";
      id: string;
      def?: string;
      tabs: { id: string; label: string; body: Block[] }[];
    };

type Step = { title: string; body: Block[] };

/* ───────────────────────── Content ───────────────────────── */
const META = {
  title: "AWS EC2 Production Deployment Guide",
  desc: "Ubuntu, a GitHub repo, Node.js, PM2, MySQL, Nginx, UFW, DNS and SSL. Everything you need to take a Node.js app from an empty EC2 instance to a secured production URL.",
  date: "Oct 01, 2026",
  read: "18 min read",
  tags: ["AWS", "DevOps", "Node.js", "Nginx"],
  image: "/aws-ec2-deployment.png",
  stack: [
    "Ubuntu",
    "GitHub",
    "Node.js",
    "PM2",
    "MySQL",
    "Nginx",
    "UFW",
    "DNS",
    "SSL",
  ],
};

const CLONE =
  "cd ~\ngit clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git\ncd YOUR_REPOSITORY\ngit status";

const NGINX_CONF = `server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_cache_bypass $http_upgrade;
    }
}`;

const SSL_CONF = `server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_cache_bypass $http_upgrade;
    }

    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    listen 80;
    listen [::]:80;

    server_name api.yourdomain.com;

    return 301 https://$host$request_uri;
}`;

const ARCH = `                  INTERNET
                      │
                      ▼
            api.yourdomain.com
                      │
                      ▼
               EC2 Public IP
                      │
                      ▼
     AWS Security Group  (22 / 80 / 443)
                      │
                      ▼
                    UFW
                      │
                      ▼
            Nginx :80 / :443
                      │
                      ▼
              127.0.0.1:3000
                      │
                      ▼
                     PM2
                      │
                      ▼
                   Node.js
                      │
                      ▼
              127.0.0.1:3306
                      │
                      ▼
                    MySQL`;

const STEPS: Step[] = [
  {
    title: "Update the server",
    body: [
      { t: "p", v: "Run this from your EC2 SSH terminal:" },
      { t: "code", v: "sudo apt update && sudo apt upgrade -y" },
      {
        t: "p",
        v: "If Ubuntu asks you to reboot, do it and reconnect afterwards:",
      },
      { t: "code", v: "sudo reboot" },
    ],
  },
  {
    title: "Install common packages",
    body: [
      {
        t: "code",
        v: "sudo apt install -y curl wget git unzip software-properties-common ufw ca-certificates",
      },
      { t: "p", v: "Check Git:" },
      { t: "code", v: "git --version" },
    ],
  },
  {
    title: "Install Node.js LTS",
    body: [
      {
        t: "code",
        v: "curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -\nsudo apt install -y nodejs",
      },
      { t: "p", v: "Check:" },
      { t: "code", v: "node -v\nnpm -v" },
    ],
  },
  {
    title: "Install PM2",
    body: [
      { t: "code", v: "sudo npm install -g pm2\npm2 -v" },
      { t: "h", v: "Restart on reboot" },
      {
        t: "p",
        v: "To bring your app back automatically after an EC2 reboot, run `pm2 startup`. PM2 prints a command. Copy and run that exact command.",
      },
      { t: "code", v: "pm2 startup" },
      {
        t: "p",
        v: "Once your app is running (step 14), save the process list:",
      },
      { t: "code", v: "pm2 save" },
      {
        t: "note",
        kind: "tip",
        v: "If you don't need auto-restart you can skip `pm2 startup` and only use `pm2 save`. For a production server, enabling it is recommended.",
      },
    ],
  },
  {
    title: "Get your code onto the server",
    body: [
      {
        t: "p",
        v: "Pick how your repository is hosted. Private is the default.",
      },
      {
        t: "tabs",
        id: "repo",
        def: "private",
        tabs: [
          {
            id: "private",
            label: "Private repo",
            body: [
              { t: "h", v: "1. Create a classic Personal Access Token" },
              {
                t: "ol",
                v: [
                  "On GitHub open `Settings → Developer settings → Personal access tokens → Tokens (classic)`.",
                  "Click `Generate new token (classic)` and name it, for example `EC2 Production Server`.",
                  "Choose an expiration and tick the `repo` scope. It grants private repository access.",
                  "Generate the token and copy it immediately. It looks like `ghp_xxxxxxxxxxxxxxxx` and is shown only once.",
                ],
              },
              {
                t: "note",
                kind: "warn",
                v: "Keep the token private. Never commit it or paste it in a chat.",
              },
              { t: "h", v: "2. Authenticate on EC2" },
              { t: "code", v: "sudo apt install -y gh\ngh auth login" },
              { t: "p", v: "Answer the prompts like this:" },
              {
                t: "code",
                lang: "prompts",
                v: "? What account do you want to log into?            > GitHub.com\n? Preferred protocol for Git operations?          > HTTPS\n? Authenticate Git with your GitHub credentials?  > Yes\n? How would you like to authenticate GitHub CLI?  > Paste an authentication token",
              },
              { t: "p", v: "Paste the token, then verify:" },
              { t: "code", v: "gh auth status" },
              {
                t: "note",
                kind: "tip",
                v: "You don't need `git config --global credential.helper store`. The GitHub CLI handles credentials for every later `git pull`.",
              },
              { t: "h", v: "3. Clone the repository" },
              { t: "code", v: CLONE },
            ],
          },
          {
            id: "public",
            label: "Normal (public) repo",
            body: [
              {
                t: "p",
                v: "A public repository needs no token and no `gh auth login`. Clone it directly:",
              },
              { t: "code", v: CLONE },
              {
                t: "note",
                kind: "tip",
                v: "If the repository is made private later, switch to the Private repo tab and authenticate before your next `git pull`.",
              },
            ],
          },
        ],
      },
      {
        t: "p",
        v: "Your project now lives at `/home/ubuntu/YOUR_REPOSITORY`.",
      },
    ],
  },
  {
    title: "Install dependencies",
    body: [
      {
        t: "p",
        v: "If the project has a `package-lock.json`, use a clean install:",
      },
      { t: "code", v: "npm ci" },
      { t: "p", v: "Otherwise:" },
      { t: "code", v: "npm install" },
    ],
  },
  {
    title: "Configure environment variables",
    body: [
      { t: "code", v: "nano .env" },
      {
        t: "code",
        lang: ".env",
        v: "NODE_ENV=production\nPORT=3000\n\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_NAME=app_db\nDB_USER=app_user\nDB_PASSWORD=YOUR_STRONG_DATABASE_PASSWORD",
      },
      {
        t: "p",
        v: "Add the rest of your application's variables. In nano, save with `Ctrl + O`, `Enter`, then exit with `Ctrl + X`. Then lock the file down:",
      },
      { t: "code", v: "chmod 600 .env" },
      {
        t: "note",
        kind: "warn",
        v: "Make sure `.env` is listed in `.gitignore`.",
      },
    ],
  },
  {
    title: "Install and secure MySQL",
    body: [
      {
        t: "code",
        v: "sudo apt install -y mysql-server\nsudo systemctl status mysql\nsudo systemctl enable mysql",
      },
      { t: "p", v: "Then run the hardening script and follow the prompts:" },
      { t: "code", v: "sudo mysql_secure_installation" },
    ],
  },
  {
    title: "Create the database and user",
    body: [
      { t: "p", v: "Open MySQL with `sudo mysql`, then run:" },
      {
        t: "code",
        lang: "sql",
        v: "CREATE DATABASE app_db;\n\nCREATE USER 'app_user'@'localhost'\nIDENTIFIED BY 'YOUR_STRONG_DATABASE_PASSWORD';\n\nGRANT ALL PRIVILEGES ON app_db.* TO 'app_user'@'localhost';\nFLUSH PRIVILEGES;\nEXIT;",
      },
      {
        t: "note",
        v: "Because the app and MySQL share one machine, the user is limited to `localhost`. To pick a character set explicitly, use `CREATE DATABASE app_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`. It isn't required for a basic deployment.",
      },
      { t: "p", v: "Test the new user:" },
      { t: "code", v: "mysql -u app_user -p app_db" },
      { t: "code", lang: "sql", v: "SHOW TABLES;\nEXIT;" },
    ],
  },
  {
    title: "Remote MySQL access (optional)",
    body: [
      {
        t: "p",
        v: "When Node.js and MySQL run on the same EC2 server you don't need to change anything. Keep `bind-address = 127.0.0.1` and use `DB_HOST=127.0.0.1`. Skip this step for a normal web application.",
      },
      {
        t: "p",
        v: "Only if you must connect from, say, MySQL Workbench on your laptop:",
      },
      { t: "code", v: "sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf" },
      { t: "p", v: "Change the bind address, save, and restart MySQL:" },
      { t: "code", lang: "ini", v: "bind-address = 0.0.0.0" },
      { t: "code", v: "sudo systemctl restart mysql" },
      { t: "p", v: "Then allow port 3306 from your own IP only:" },
      {
        t: "code",
        v: "sudo ufw allow from YOUR_PUBLIC_IP to any port 3306 proto tcp",
      },
      {
        t: "note",
        kind: "warn",
        v: "Never open 3306 to the whole internet. Restrict both the AWS Security Group and UFW to your specific public IP. You can check your public IP with `https://checkip.amazonaws.com/`.",
      },
    ],
  },
  {
    title: "Build the app (if required)",
    body: [
      {
        t: "p",
        v: "This depends on your project. TypeScript, Next.js and anything else with a build step:",
      },
      { t: "code", v: "npm ci\nnpm run build" },
      {
        t: "p",
        v: "A plain JavaScript backend (`server.js`, `app.js`, `index.js`) with no build script can skip `npm run build`. Install dependencies and start it.",
      },
    ],
  },
  {
    title: "Install Nginx",
    body: [
      {
        t: "code",
        v: "sudo apt install -y nginx\nsudo systemctl enable nginx\nsudo systemctl start nginx\nsudo systemctl status nginx",
      },
    ],
  },
  {
    title: "Configure Nginx",
    body: [
      { t: "p", v: "Create the site config:" },
      { t: "code", v: "sudo nano /etc/nginx/sites-available/app" },
      { t: "code", lang: "nginx", v: NGINX_CONF },
      {
        t: "note",
        kind: "tip",
        v: "Hosting a backend API on a subdomain? Use `server_name api.yourdomain.com;` instead.",
      },
      { t: "p", v: "Enable it, drop the default site, test and restart:" },
      {
        t: "code",
        v: "sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/app\nsudo rm -f /etc/nginx/sites-enabled/default\nsudo nginx -t\nsudo systemctl restart nginx",
      },
      {
        t: "p",
        v: "`nginx -t` should report `syntax is ok` and `test is successful`.",
      },
    ],
  },
  {
    title: "Start the app with PM2",
    body: [
      {
        t: "p",
        v: "Use the start command that matches how your project runs. Check your `package.json` if unsure.",
      },
      {
        t: "tabs",
        id: "start",
        def: "js",
        tabs: [
          {
            id: "js",
            label: "JavaScript (server.js)",
            body: [
              { t: "p", v: "A plain JavaScript backend with no build step:" },
              {
                t: "code",
                v: "cd ~/YOUR_REPOSITORY\nnpm ci\npm2 start server.js --name app\npm2 save",
              },
            ],
          },
          {
            id: "ts",
            label: "TypeScript (dist)",
            body: [
              { t: "p", v: "A TypeScript backend that compiles to `dist`:" },
              {
                t: "code",
                v: "cd ~/YOUR_REPOSITORY\nnpm ci\nnpm run build\npm2 start dist/server.js --name app\npm2 save",
              },
            ],
          },
          {
            id: "npm",
            label: "npm start",
            body: [
              {
                t: "p",
                v: "A project designed around its `start` script (Next.js, for example):",
              },
              {
                t: "code",
                v: "cd ~/YOUR_REPOSITORY\nnpm ci\nnpm run build\npm2 start npm --name app -- start\npm2 save",
              },
            ],
          },
        ],
      },
      {
        t: "note",
        v: "The exact PM2 start command should match what your project's `package.json` actually uses.",
      },
      { t: "h", v: "Test it locally" },
      {
        t: "p",
        v: "Before touching DNS or SSL, confirm the app answers on its own port:",
      },
      { t: "code", v: "curl http://127.0.0.1:3000\npm2 logs app\npm2 list" },
      { t: "h", v: "Cluster mode (optional)" },
      {
        t: "p",
        v: "`-i max` starts one worker per CPU core. On a 2-vCPU machine you will see two workers in `pm2 list`.",
      },
      {
        t: "code",
        v: "# using server.js\npm2 start server.js --name app -i max\n\n# using npm start\npm2 start npm --name app -i max -- start",
      },
      {
        t: "note",
        kind: "warn",
        v: "Don't use cluster mode by default. It suits stateless HTTP apps. In-memory sessions, local state and WebSockets may need extra configuration.",
      },
    ],
  },
  {
    title: "Configure DNS",
    body: [
      {
        t: "p",
        v: "This happens at your DNS provider, not in the SSH terminal. For a normal website, create two A records:",
      },
      {
        t: "code",
        lang: "dns",
        v: "Type: A    Name: @      Value: YOUR_EC2_PUBLIC_IP    TTL: 300\nType: A    Name: www    Value: YOUR_EC2_PUBLIC_IP    TTL: 300",
      },
      { t: "p", v: "For a backend API on `api.yourdomain.com`:" },
      {
        t: "code",
        lang: "dns",
        v: "Type: A    Name: api    Value: YOUR_EC2_PUBLIC_IP    TTL: 300",
      },
      { t: "p", v: "Then confirm it resolves to your EC2 public IP:" },
      {
        t: "code",
        v: "nslookup yourdomain.com\nnslookup api.yourdomain.com\ndig api.yourdomain.com",
      },
    ],
  },
  {
    title: "Configure UFW",
    body: [
      {
        t: "p",
        v: "Allow SSH first, so you don't lock yourself out, then web traffic:",
      },
      {
        t: "code",
        v: "sudo ufw allow OpenSSH\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\n\n# or, for both web ports at once:\nsudo ufw allow 'Nginx Full'",
      },
      { t: "p", v: "Review, enable, and check again:" },
      {
        t: "code",
        v: "sudo ufw status\nsudo ufw enable\nsudo ufw status verbose",
      },
      {
        t: "p",
        v: "You should see 22, 80 and 443 allowed. Don't add 3306 for the normal setup.",
      },
    ],
  },
  {
    title: "Test over HTTP",
    body: [
      {
        t: "p",
        v: "Open `http://yourdomain.com` (or `http://api.yourdomain.com`). The request travels like this:",
      },
      {
        t: "code",
        lang: "flow",
        v: "Browser → AWS Security Group :80 → UFW :80 → Nginx → 127.0.0.1:3000 → PM2 → Application",
      },
      {
        t: "note",
        kind: "warn",
        v: "Make sure plain HTTP works before you set up SSL.",
      },
    ],
  },
  {
    title: "Add SSL with Certbot",
    body: [
      { t: "code", v: "sudo apt install -y certbot python3-certbot-nginx" },
      { t: "p", v: "Request a certificate for the domains you configured:" },
      {
        t: "tabs",
        id: "ssl",
        def: "site",
        tabs: [
          {
            id: "site",
            label: "Website",
            body: [
              {
                t: "code",
                v: "sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com",
              },
            ],
          },
          {
            id: "api",
            label: "API",
            body: [
              { t: "code", v: "sudo certbot --nginx -d api.yourdomain.com" },
            ],
          },
        ],
      },
      {
        t: "p",
        v: "If Certbot asks whether to redirect HTTP to HTTPS, select the redirect option.",
      },
      {
        t: "p",
        v: "At this point Certbot modifies `/etc/nginx/sites-available/app` and adds the SSL configuration.",
      },
      { t: "h", v: "Check the configuration Certbot generated" },
      { t: "p", v: "Now you can inspect it:" },
      { t: "code", v: "sudo nano /etc/nginx/sites-available/app" },
      {
        t: "p",
        v: "You may see something approximately like this (shown for an API on `api.yourdomain.com`):",
      },
      { t: "code", lang: "nginx", v: SSL_CONF },
      {
        t: "note",
        kind: "warn",
        v: "Don't manually replace the file with this configuration unless Certbot failed to modify it. Normally, just inspect what Certbot generated.",
      },
      { t: "p", v: "Save and exit if you opened it:" },
      { t: "code", lang: "nano", v: "Ctrl + O\nEnter\nCtrl + X" },
      { t: "p", v: "Then re-test Nginx:" },
      { t: "code", v: "sudo nginx -t\nsudo systemctl restart nginx" },
      {
        t: "p",
        v: "Open `https://yourdomain.com` (or `https://api.yourdomain.com`). Finally, confirm automatic renewal works:",
      },
      {
        t: "code",
        v: "sudo systemctl status certbot.timer\nsudo certbot renew --dry-run",
      },
    ],
  },
  {
    title: "AWS Security Group",
    body: [
      {
        t: "p",
        v: "In the AWS Console go to `EC2 → Instances → your instance → Security → Security groups → Inbound rules`.",
      },
      {
        t: "code",
        lang: "inbound rules",
        v: "Type     Port   Source\nSSH      22     Your IP\nHTTP     80     0.0.0.0/0\nHTTPS    443    0.0.0.0/0",
      },
      {
        t: "p",
        v: "If your server uses IPv6, add the matching `::/0` rules too.",
      },
      {
        t: "note",
        kind: "warn",
        v: "Don't expose 3000 or 3306 publicly. Nginx takes public HTTP/HTTPS traffic and forwards to 3000 internally, and MySQL stays internal on 3306.",
      },
    ],
  },
  {
    title: "Command cheat sheet",
    body: [
      { t: "p", v: "The commands you'll reach for after the server is live." },
      {
        t: "tabs",
        id: "cmds",
        def: "nginx",
        tabs: [
          {
            id: "nginx",
            label: "Nginx",
            body: [
              {
                t: "code",
                v: "sudo nginx -t                        # test config\nsudo systemctl restart nginx         # restart\nsudo systemctl reload nginx          # reload without dropping connections\nsudo systemctl status nginx          # status\nsudo tail -f /var/log/nginx/error.log\nsudo tail -f /var/log/nginx/access.log",
              },
            ],
          },
          {
            id: "pm2",
            label: "PM2",
            body: [
              {
                t: "code",
                v: "pm2 list              # all processes\npm2 logs              # all logs\npm2 logs app          # one app\npm2 restart app\npm2 stop app\npm2 delete app\npm2 save              # persist the process list\npm2 monit             # live monitor",
              },
            ],
          },
          {
            id: "mysql",
            label: "MySQL",
            body: [
              {
                t: "code",
                v: "sudo systemctl status mysql\nsudo systemctl restart mysql\nmysql -u app_user -p app_db    # app user\nsudo mysql                     # admin access",
              },
            ],
          },
          {
            id: "ufw",
            label: "UFW",
            body: [
              {
                t: "code",
                v: "sudo ufw status verbose\nsudo ufw status numbered\nsudo ufw delete NUMBER",
              },
            ],
          },
          {
            id: "deploy",
            label: "Future deployments",
            body: [
              {
                t: "p",
                v: "Once the server is configured you never repeat the setup. To ship new code:",
              },
              {
                t: "code",
                v: "cd ~/YOUR_REPOSITORY\ngit pull origin main\nnpm ci              # only if dependencies changed\nnpm run build       # only if the project has a build step\npm2 restart app\npm2 logs app",
              },
              {
                t: "note",
                kind: "tip",
                v: "A plain JS backend has no build step, so skip `npm run build`. If you used the Private repo tab, you don't need to authenticate again.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Final architecture",
    body: [
      { t: "p", v: "For a backend API, this is what you've built:" },
      { t: "code", lang: "architecture", v: ARCH },
      { t: "h", v: "Setup checklist" },
      {
        t: "ol",
        v: [
          "Update Ubuntu and install common packages.",
          "Install Node.js LTS and PM2.",
          "Authenticate with GitHub (private repos) and clone the repository.",
          "Run `npm ci` and configure `.env`.",
          "Install MySQL, then create the database and app user.",
          "Build the app if it has a build step.",
          "Install and configure Nginx.",
          "Start the app with PM2, test on `127.0.0.1:3000`, and run `pm2 save`.",
          "Point DNS at the EC2 public IP and check it resolves.",
          "Open ports 22, 80 and 443 in the Security Group and UFW.",
          "Test over HTTP, then add SSL with Certbot and test renewal.",
        ],
      },
    ],
  },
];

/* ───────────────────────── UI pieces ───────────────────────── */
const rich = (s: string) =>
  s.split(/(`[^`]+`)/g).map((p, i) =>
    p.length > 1 && p.startsWith("`") && p.endsWith("`") ? (
      <code
        key={i}
        className="break-words rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-neutral-100"
      >
        {p.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{p}</span>
    ),
  );

function Code({ v, lang }: { v: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(v);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  return (
    <div
      data-code
      className="min-w-0 overflow-hidden rounded-md border border-white/10 bg-black/40"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 font-mono text-[9px] text-neutral-500">
        <span>{lang ?? "bash"}</span>
        <button
          type="button"
          data-copy
          onClick={copy}
          className="flex items-center gap-1 hover:text-white"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          <span data-copy-label>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-[18px] text-neutral-200">
        <code>{v}</code>
      </pre>
    </div>
  );
}

function Tabs({ id, tabs, def }: Extract<Block, { t: "tabs" }>) {
  const [active, setActive] = useState(def ?? tabs[0].id);
  return (
    <div
      data-group={id}
      className="min-w-0 rounded-md border border-white/10 bg-white/[.02] p-3"
    >
      <div
        role="tablist"
        className="flex gap-1 overflow-x-auto rounded-md border border-white/10 p-1 font-mono text-[9px] text-neutral-400"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            data-tab={t.id}
            aria-selected={t.id === active}
            onClick={() => setActive(t.id)}
            className={`shrink-0 rounded px-3 py-1.5 ${t.id === active ? "bg-white/10 text-white" : "hover:text-white"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          data-panel={t.id}
          className={`mt-4 ${t.id === active ? "" : "hidden"}`}
        >
          <Blocks items={t.body} />
        </div>
      ))}
    </div>
  );
}

const NOTE = {
  note: ["NOTE", "text-neutral-400"],
  tip: ["TIP", "text-emerald-400"],
  warn: ["IMPORTANT", "text-amber-300"],
} as const;

function Blocks({ items }: { items: Block[] }) {
  return (
    <div className="min-w-0 space-y-4">
      {items.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{rich(b.v)}</p>;
          case "h":
            return (
              <h3
                key={i}
                className="pt-1 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-200"
              >
                {b.v}
              </h3>
            );
          case "ul":
          case "ol": {
            const List = b.t;
            return (
              <List
                key={i}
                className={`space-y-2 pl-5 ${b.t === "ol" ? "list-decimal" : "list-disc"} marker:text-neutral-600`}
              >
                {b.v.map((li, j) => (
                  <li key={j}>{rich(li)}</li>
                ))}
              </List>
            );
          }
          case "code":
            return <Code key={i} v={b.v} lang={b.lang} />;
          case "note": {
            const [label, color] = NOTE[b.kind ?? "note"];
            return (
              <div
                key={i}
                className="rounded-md border border-white/10 bg-white/[.02] px-3 py-2.5 text-[12px] leading-[19px] text-neutral-400"
              >
                <span
                  className={`mr-2 font-mono text-[9px] font-bold tracking-widest ${color}`}
                >
                  {label}
                </span>
                {rich(b.v)}
              </div>
            );
          }
          case "tabs":
            return <Tabs key={i} {...b} />;
        }
      })}
    </div>
  );
}

/* ───────────────────────── Page ───────────────────────── */
export default function EC2DeploymentGuide() {
  return (
    <article className="min-w-0">
      <header className="border-b border-white/10">
        <div className="px-4 py-8 sm:px-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={12} /> All blogs
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-neutral-500">
            <span>{META.date}</span>
            <span>·</span>
            <span>{META.read}</span>
          </div>
          <h1 className="mt-3 font-serif text-[32px] leading-[1.1] text-white sm:text-[42px]">
            {META.title}
          </h1>
          <p className="mt-4 text-[13px] leading-[22px] text-neutral-300">
            {META.desc}
          </p>
        </div>
        <div className="border-t border-white/10 px-4 py-5 sm:px-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            What we'll set up
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {META.stack.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-neutral-300"
              >
                {/* <i className="size-2.5 rounded-sm bg-neutral-600" /> */}
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t border-white/10 p-4 sm:p-6">
          <a
            href={META.image}
            target="_blank"
            rel="noreferrer"
            className="group block min-w-0 rounded-md border border-white/10 bg-white/[.02] p-3"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-sm bg-neutral-900">
              <Image
                src={META.image}
                alt={"EC2 deployment architecture diagram"}
                fill
                sizes="(min-width: 720px) 640px, 100vw"
                priority
                className="object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[9px] text-neutral-500 group-hover:text-white">
              <span>Fig. 1: EC2 deployment architecture diagram</span>
              <span className="flex shrink-0 items-center gap-1">
                Open full size <ArrowUpRight size={10} />
              </span>
            </div>
          </a>
        </div>
      </header>

      <nav aria-label="On this page" className="border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="px-4 py-3 sm:px-6">
          <h2 className="font-serif text-[22px] leading-none text-white">
            On This Page
          </h2>
        </div>
        <ol className="grid gap-x-6 gap-y-1.5 border-t border-white/10 px-4 py-4 font-mono text-[11px] text-neutral-430 sm:grid-cols-2 sm:px-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="min-w-0">
              <a
                href={`#step-${i + 1}`}
                className="flex gap-2 hover:text-primary hover:font-semibold"
              >
                <span className="text-neutral-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{s.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section className="min-w-0 border-b border-white/10">
        <div className="hatch h-6 border-b border-white/10" />
        <div className="flex flex-col items-start justify-between gap-4 px-4 py-6 sm:flex-row sm:items-center sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500">
              Quick check
            </p>
            <p className="mt-2 font-serif text-[20px] leading-[1.15] text-white">
              How to Launch an AWS EC2 Instance
            </p>
          </div>
          <a
            href="/blogs/launch-ec2-instance"
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-[11px] font-semibold text-black"
          >
            Continue <ArrowUpRight size={12} />
          </a>
        </div>
      </section>

      {STEPS.map((s, i) => (
        <section
          key={s.title}
          id={`step-${i + 1}`}
          className="min-w-0 scroll-mt-12 border-b border-white/10"
        >
          <div className="hatch h-6 border-b border-white/10" />
          <div className="flex items-baseline gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
            <span className="font-mono text-[10px] text-neutral-500">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="min-w-0 font-serif text-[22px] leading-[1.15] text-white">
              {s.title}
            </h2>
          </div>
          <div className="px-4 py-5 text-[13px] leading-[22px] text-neutral-300 sm:px-6">
            <Blocks items={s.body} />
          </div>
        </section>
      ))}
    </article>
  );
}
