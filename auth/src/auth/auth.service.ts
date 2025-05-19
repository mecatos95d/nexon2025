import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';

@Injectable()
export class AuthService {
  private readonly uri = 'mongodb://mongodb:27017';
  private readonly dbName = 'auth';
  private readonly collectionName = 'auth';

  async validateUser(id: string, password: string) {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      return await collection.findOne({ id, password });
    } finally {
      await client.close();
    }
  }

  async findUserById(id: string) {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      return await collection.findOne({ id });
    } finally {
      await client.close();
    }
  }

  async register(id: string, password: string, role: string) {
    const client = new MongoClient(this.uri);
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collection = db.collection(this.collectionName);
      await collection.insertOne({ id, password, role });
    } finally {
      await client.close();
    }
  }
}
