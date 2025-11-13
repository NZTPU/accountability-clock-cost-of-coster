import { DurableObject } from "cloudflare:workers";
import type { DemoItem, CalculatorData } from '@shared/types';
import { MOCK_ITEMS } from '@shared/mock-data';
// **DO NOT MODIFY THE CLASS NAME**
export class GlobalDurableObject extends DurableObject {
    async getCounterValue(): Promise<number> {
      const value = (await this.ctx.storage.get("counter_value")) || 0;
      return value as number;
    }
    async increment(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value += amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async decrement(amount = 1): Promise<number> {
      let value: number = (await this.ctx.storage.get("counter_value")) || 0;
      value -= amount;
      await this.ctx.storage.put("counter_value", value);
      return value;
    }
    async getDemoItems(): Promise<DemoItem[]> {
      const items = await this.ctx.storage.get("demo_items");
      if (items) {
        return items as DemoItem[];
      }
      await this.ctx.storage.put("demo_items", MOCK_ITEMS);
      return MOCK_ITEMS;
    }
    async addDemoItem(item: DemoItem): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = [...items, item];
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async updateDemoItem(id: string, updates: Partial<Omit<DemoItem, 'id'>>): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async deleteDemoItem(id: string): Promise<DemoItem[]> {
      const items = await this.getDemoItems();
      const updatedItems = items.filter(item => item.id !== id);
      await this.ctx.storage.put("demo_items", updatedItems);
      return updatedItems;
    }
    async getCalculatorData(): Promise<CalculatorData> {
      // In a real application, this might come from storage or an external source.
      // For this project, it's hardcoded as per the blueprint.
      const data: CalculatorData = {
        annualSalary: 558235.2941, // Updated salary based on client feedback
        startDate: "2025-11-11T00:00:00Z", // Updated start date based on client feedback
        personName: "Andrew Coster",
        imageUrl: "https://www.nzherald.co.nz/resizer/v2/AFGBQ7MUKFFQXMMNLD223HC4IQ.jpg?auth=73d0deb9a020da523eea2c60f3d3a49eb5e7c77bd669dfef35f6d5c95b8b3874&width=576&height=613&quality=70&smart=true",
        contextText: "Disgraced former Police Commissioner Andrew Coster may be off the job, but he’s still on the payroll. The Costly Coster Calculator shows how much taxpayers are forking out every second he remains on paid leave.",
      };
      return data;
    }
}