# Deployment

## Overview

This document provides instructions for deploying the project, including prerequisites and deployment steps.

### **Prerequisites**

- Set up the required environment variables (e.g., `DATABASE_URL`).

### **Deployment Steps**

1. **Install Dependencies**:

   ```bash
   pnpm i
   ```

1. **Deploy the Migrations**:

   ```bash
   pnpm cdk:migrations deploy
   ```

1. **Deploy the Engine**:

   ```bash
   pnpm cdk:engine deploy
   ```

1. **Deploy the App**:
   1. Ensure you have [linked](https://vercel.com/docs/monorepos#add-a-monorepo-through-vercel-cli) the application.
   2. Run the deployment command:
      ```bash
      pnpm vercel deploy --prod
      ```
