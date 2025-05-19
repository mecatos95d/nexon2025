import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class EventService {
  private readonly uri = 'mongodb://mongodb:27017';
  private readonly dbName = 'event';
  private readonly collectionName = 'event';

  async eventNew(body: any): Promise<any> {
    const { name, startDate, endDate, condition, status = 'inactive' } = body;
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      const result = await collection.insertOne({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        condition,
        status: status === 'active' ? 'active' : 'inactive',
        createdAt: new Date(),
      });
      return { success: true, eventId: result.insertedId };
    } catch (e) {
      return {
        success: false,
        message: e.message || e.toString() || 'Unknown message',
      };
    } finally {
      await client.close();
    }
  }

  async eventLog(body: any): Promise<any> {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);

      const filter: any = {};
      if (body._id) filter._id = body._id;
      if (body.name) filter.name = body.name;
      if (body.condition) filter.condition = body.condition;
      if (body.status) filter.status = body.status;
      if (body.startDate) filter.startDate = { $gte: new Date(body.startDate) };
      if (body.endDate) filter.endDate = { $lte: new Date(body.endDate) };

      const events = await collection.find(filter).toArray();
      return { success: true, events };
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
