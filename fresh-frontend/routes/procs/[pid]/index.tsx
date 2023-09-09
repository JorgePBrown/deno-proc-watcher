import { PageProps } from "$fresh/server.ts";

export default function ProcPage(props: PageProps) {
  const { pid } = props.params;
  return <a href={`/procs/${pid}/watch`}>Watch</a>;
}
