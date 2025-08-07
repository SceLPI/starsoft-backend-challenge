import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Order } from 'src/domain/entities/Order';

@Injectable()
export class SearchService {
  private readonly index = 'orders';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexOrder(order: Order) {
    await this.elasticsearchService.index({
      index: this.index,
      id: order.id,
      document: order,
    });
  }

  async search(term: string) {
    const result = await this.elasticsearchService.search({
      index: this.index,
      query: {
        bool: {
          should: [
            { wildcard: { id: `${term}` } },
            { wildcard: { status: `${term}` } },
            { wildcard: { 'items.item.name': `${term}` } },
          ],
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }

  async delete(id: string) {
    await this.elasticsearchService.delete({
      index: this.index,
      id,
    });
  }
}
