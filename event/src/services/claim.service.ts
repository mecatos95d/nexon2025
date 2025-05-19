import { Injectable } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';

@Injectable()
export class ClaimService {
  private readonly uri = 'mongodb://mongodb:27017';
  private readonly dbName = 'event';
  private readonly collectionName = 'claim';
  private readonly collectionEventName = 'event';
  private readonly collectionRewardName = 'reward';
  private readonly collectionValidityName = 'validity';

  async rewardClaim(body: any): Promise<any> {
    let { event_id, user_id } = body;

    try {
      event_id = new ObjectId(event_id);
    } catch {
      return {
        success: false,
        message: 'event_id는 올바른 ObjectId여야 합니다.',
      };
    }

    try {
      user_id = new ObjectId(user_id);
    } catch {
      return {
        success: false,
        message: 'user_id는 올바른 ObjectId여야 합니다.',
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

      const validity = await db
        .collection(this.collectionValidityName)
        .findOne({ event_id, user_id, valid: true });
      if (!validity) {
        await db.collection(this.collectionName).insertOne({
          event_id,
          user_id,
          items: [],
          success: false,
          message: '이벤트 조건을 충족하지 않았습니다.',
          createdAt: new Date(),
        });
        return {
          success: false,
          message: '이벤트 조건을 충족하지 않았습니다.',
        };
      }

      const claimed = await db
        .collection(this.collectionName)
        .findOne({ event_id, user_id, success: true });
      if (claimed) {
        await db.collection(this.collectionName).insertOne({
          event_id,
          user_id,
          items: [],
          success: false,
          message: '이미 보상을 수령하였습니다.',
          createdAt: new Date(),
        });
        return {
          success: false,
          message: '이미 보상을 수령하였습니다.',
        };
      }

      const reward = await db
        .collection(this.collectionRewardName)
        .findOne({ event_id });
      if (!reward || !Array.isArray(reward.items)) {
        await db.collection(this.collectionName).insertOne({
          event_id,
          user_id,
          items: [],
          success: false,
          message: '보상 정보가 존재하지 않습니다.',
          createdAt: new Date(),
        });
        return {
          success: false,
          message: '보상 정보가 존재하지 않습니다.',
        };
      }

      await db.collection(this.collectionName).insertOne({
        event_id,
        user_id,
        items: reward.items,
        success: true,
        createdAt: new Date(),
        claimedAt: new Date(),
      });

      return {
        success: true,
        items: reward.items,
        message: '보상을 성공적으로 지급하였습니다.',
      };
    } catch (e) {
      return {
        success: false,
        message: e.message || e.toString() || 'Unknown message',
      };
    } finally {
      await client.close();
    }
  }

  async rewardClaimLog(body: any): Promise<any> {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);

      let { claim_id, event_id, search_user, user_id, role } = body;
      claim_id = new ObjectId(claim_id);
      event_id = new ObjectId(event_id);
      search_user = new ObjectId(search_user);
      user_id = new ObjectId(user_id);

      const filter: any = {};
      if (body.claim_id) filter._id = claim_id;
      if (body.event_id) filter.event_id = event_id;
      if (['ADMIN', 'AUDITOR', 'OPERATOR'].includes(role)) {
        if (body.search_user) filter.user_id = search_user;
      } else {
        if (body.search_user) {
          return {
            success: false,
            message: '일반 유저는 다른 유저의 보상 내역을 조회할 수 없습니다.',
          };
        }
        if (!user_id) {
          return {
            success: false,
            message: '유저 검색 오류',
          };
        }
        filter.user_id = user_id;
      }

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

  // FOR DEMO
  async rewardValid(body: any): Promise<any> {
    let { event_id, user_id } = body;

    try {
      event_id = new ObjectId(event_id);
    } catch {
      return {
        success: false,
        message: 'event_id는 올바른 ObjectId여야 합니다.',
      };
    }

    try {
      user_id = new ObjectId(user_id);
    } catch {
      return {
        success: false,
        message: 'user_id는 올바른 ObjectId여야 합니다.',
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

      const validity = await db
        .collection(this.collectionValidityName)
        .insertOne({ event_id, user_id, valid: true });

      return {
        success: true,
        message: '이벤트 조건을 충족하였습니다.',
      };
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
