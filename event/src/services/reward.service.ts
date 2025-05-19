import { Injectable } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class RewardService {
  private readonly uri = 'mongodb://localhost:27017';
  private readonly dbName = 'event';
  private readonly collectionName = 'reward';
  private readonly collectionEventName = 'event';

  async rewardNew(body: any): Promise<any> {
    let { event_id, items } = body;

    if (
      !Array.isArray(items) ||
      items.some(
        (i) =>
          typeof i !== 'object' ||
          typeof i?.item !== 'string' ||
          typeof i?.amount !== 'number',
      )
    ) {
      return {
        success: false,
        message:
          'items는 {item: string, amount: number} 객체의 배열이어야 합니다.',
      };
    }

    try {
      event_id = new ObjectId(event_id);
    } catch {
      return {
        success: false,
        message: 'event_id는 올바른 ObjectId여야 합니다.',
      };
    }

    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);

      const event = await db
        .collection(this.collectionEventName)
        .findOne({ _id: event_id });
      if (!event) {
        return {
          success: false,
          message: '해당 event_id의 이벤트가 존재하지 않습니다.',
        };
      }

      const collection = db.collection(this.collectionName);
      const result = await collection.insertOne({ event_id, items });
      return { success: true, rewardId: result.insertedId };
    } catch (e) {
      return {
        success: false,
        message: e.message || e.toString() || 'Unknown message',
      };
    } finally {
      await client.close();
    }
  }

  async rewardLog(body: any): Promise<any> {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);

      let { reward_id, event_id } = body;
      event_id = new ObjectId(event_id);
      reward_id = new ObjectId(reward_id);

      const filter: any = {};
      if (body.event_id) filter.event_id = event_id;
      if (body.reward_id) filter._id = reward_id;

      const rewards = await collection.find(filter).toArray();
      return { success: true, rewards };
    } catch (e) {
      return {
        success: false,
        message: e.message || e.toString() || 'Unknown message',
      };
    } finally {
      await client.close();
    }
  }
}
