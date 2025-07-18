import { OffsetPagination } from './offset-pagination.request';
import { IPageRequest } from '@shared/common/types';

export class PageRequest {
	static of({ size, page }: OffsetPagination): IPageRequest {
		return {
			size,
			page,
			offset: (page - 1) * size,
		};
	}
}
