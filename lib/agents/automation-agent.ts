import axios from 'axios';

export class AutomationAgent {
  private n8nUrl: string;
  private n8nToken: string;

  constructor() {
    this.n8nUrl = process.env.N8N_URL!;
    this.n8nToken = process.env.N8N_API_TOKEN!;
  }

  async execute(data: AutomationTask) {
    switch (data.action) {
      case 'trigger-workflow':
        return this.triggerWorkflow(data.workflowId, data.payload);
      case 'create-workflow':
        return this.createWorkflow(data.workflow);
      case 'update-workflow':
        return this.updateWorkflow(data.workflowId, data.workflow);
      case 'delete-workflow':
        return this.deleteWorkflow(data.workflowId);
      default:
        throw new Error(`Unknown automation action: ${data.action}`);
    }
  }

  async triggerWorkflow(workflowId: string, payload: any) {
    const response = await axios.post(
      `${this.n8nUrl}/webhook/${workflowId}`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${this.n8nToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  async createWorkflow(workflow: N8nWorkflow) {
    const response = await axios.post(
      `${this.n8nUrl}/workflows`,
      workflow,
      {
        headers: {
          'Authorization': `Bearer ${this.n8nToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  async updateWorkflow(workflowId: string, workflow: N8nWorkflow) {
    const response = await axios.put(
      `${this.n8nUrl}/workflows/${workflowId}`,
      workflow,
      {
        headers: {
          'Authorization': `Bearer ${this.n8nToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  async deleteWorkflow(workflowId: string) {
    const response = await axios.delete(
      `${this.n8nUrl}/workflows/${workflowId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.n8nToken}`,
        },
      }
    );

    return response.data;
  }
}

interface AutomationTask {
  action: 'trigger-workflow' | 'create-workflow' | 'update-workflow' | 'delete-workflow';
  workflowId?: string;
  workflow?: N8nWorkflow;
  payload?: any;
}

interface N8nWorkflow {
  name: string;
  nodes: N8nNode[];
  connections: N8nConnection[];
  settings?: any;
  tags?: string[];
}

interface N8nNode {
  id: string;
  name: string;
  type: string;
  parameters: any;
  position: [number, number];
}

interface N8nConnection {
  source: string;
  target: string;
  type: string;
}
