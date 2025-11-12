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
        annualSalary: 470000, // Placeholder salary, similar to NZ Prime Minister
        startDate: "2024-11-11T09:00:00Z", // A plausible recent start date for the leave
        personName: "Andrew Coster",
        imageUrl: "https://www.taxpayers.org.nz/assets/News/Comms/Andrew-Coster-Police.jpg",
        contextText: `The Taxpayers’ Union is publicly calling on Public Service Commissioner Brian Roche to immediately sack Social Investment Agency chief executive Andrew Coster following the release of a damning Independent Police Conduct Authority (IPCA) report. The IPCA found senior police failed to follow proper procedure when serious complaints were made against then-Police Deputy Commissioner Jevon McSkimming and instead launched a prosecution against the woman who reported him. The IPCA report says police leaders showed “serious misconduct” and a “total lack of leadership and integrity” in how they handled complaints dating back to 2023 and early 2024. The findings come just days after McSkimming, 52, appeared in the Wellington District Court on November 6 and pleaded guilty to possessing objectionable material. The charges relate to images of child sexual exploitation and bestiality found on his police-issued devices while he was being investigated over another matter. It was that wider inquiry which first brought to light the full extent of McSkimming’s alleged offending. The IPCA found senior police figures, including then-Police Commissioner Andrew Coster, two deputy commissioners and an assistant commissioner, failed to act when complaints were raised via emails, social-media posts and the police 105 reporting line by a younger woman who had an affair with McSkimming. When police eventually referred the case to the IPCA in October, 2024, Coster tried to influence the scope and timing of the watchdog’s investigation, which the authority said appeared designed to avoid affecting McSkimming’s prospects of becoming the next commissioner. It also found Coster failed to disclose his knowledge of McSkimming’s relationship with the woman during earlier appointment processes. Coster has since been placed on leave from his role leading the Social Investment Agency. Taxpayers’ Union spokesman Jordan Williams says Roche should sack Coster and rule out a golden handshake or exit payout for him. “This follows revelations that the former Police Commissioner ‘lacks integrity’ and ‘lacks leadership’, according to current Police Commissioner Richard Chambers,” Williams says. “Coster is currently on garden leave as CEO of the Social Investment Agency and receiving full pay. Every hour Andrew Coster remains on the public payroll is a disgrace. “He’s on similar pay to the Prime Minister, despite being exposed as totally unfit for leadership. “The public service is treating taxpayers like fools, and Brian Roche is letting it happen. “Under Coster’s watch, a victim was charged with harassment, while a secret protocol was implemented to hide information from the Police Minister. “The IPCA even say that then-Commissioner Coster attempted to influence the nature and extent of their investigation. “These are not technical slip-ups, they were serious abuses of trust. Yet rather than being shown the door, Coster continues to enjoy full pay on garden leave. It’s a slap in the face to victims. “This is exactly what’s wrong with New Zealand’s bloated and unaccountable bureaucracy. “When ordinary Kiwis fail at their jobs, they get marched out the door. When top bureaucrats fail, even spectacularly, they get months of paid leave and more often than not a payout. “Roche needs to front up to media this morning and assure taxpayers there will be no payout, no golden goodbye, and no soft landing for Coster funded that costs taxpayers. “Current laws prevent Ministers from firing senior officials who’ve lost public confidence without costly payouts. “The Taxpayers’ Union says that to improve public sector accountability, those laws need to change.”`,
      };
      return data;
    }
}