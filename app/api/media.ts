import { socketRequest } from '@/socket';
import { IMediaVO } from '@/store/media';
import { Res } from '.';

export async function reqGetMediaList(): Promise<Res<IMediaVO[]>> {
  return socketRequest('/media/list');
}
