import DataLoader from 'dataloader';

export const getListItemsLoader = ({ Item }) =>
  new DataLoader(async (listIds) => {
    const items = await Item.find({ list: { $in: listIds } });

    // const items2 = await Item.aggregate([
    //   { $match: { list: { $in: listIds } } },
    //   {
    //     $graphLookup: {
    //       from: 'users',
    //       startWith: '$creator.username',
    //       connectFromField: 'username',
    //       connectToField: 'username',
    //       as: 'maker',
    //     },
    //   },
    // ]);

    // console.log('items: ', items);
    // console.log('items2: ', items2[0]);
    // console.log('items2.maker: ', items2[0].maker);

    return listIds.reduce(
      (newArray, id) => [...newArray, items.filter((item) => item.list === id)],
      [],
    );

    // const toReturn = listIds.reduce(
    //   (newArray, id) => [
    //     ...newArray,
    //     items2.filter((item) => item.list === id),
    //   ],
    //   [],
    // );
    // console.log('toReturn: ', toReturn);

    // return toReturn;
  });
